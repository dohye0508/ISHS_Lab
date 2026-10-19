/* KakaoTalk export parser.
 * Supports the desktop .txt export, the Android/iOS mobile .txt exports and the Date,User,Message CSV export.
 * Pure functions only, so it runs in the browser, in a Web Worker and in Node (scripts/check_kakaotalk.cjs). */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.KakaoParser = factory();
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var KIND = { TEXT: 0, PHOTO: 1, EMOTICON: 2, VIDEO: 3, FILE: 4, SEARCH: 5, VOICE: 6, DELETED: 7 };

    var PC_DATE = /^-{3,} (\d{4})년 (\d{1,2})월 (\d{1,2})일 .+? -{3,}$/;
    var PC_MSG = /^\[([^\]]+)\] \[(오전|오후) (\d{1,2}):(\d{2})\] ([\s\S]*)$/;
    var MOBILE_DATE = /^(\d{4})(?:년 |\. )(\d{1,2})(?:월 |\. )(\d{1,2})(?:일|\.)(?: [월화수목금토일]요일)?(?: (?:오전|오후) \d{1,2}:\d{2})?$/;
    var MOBILE_MSG = /^(\d{4})(?:년 |\. )(\d{1,2})(?:월 |\. )(\d{1,2})(?:일|\.) (오전|오후) (\d{1,2}):(\d{2}), (.+?) : ([\s\S]*)$/;
    var MOBILE_SYS = /^(\d{4})(?:년 |\. )(\d{1,2})(?:월 |\. )(\d{1,2})(?:일|\.) (오전|오후) (\d{1,2}):(\d{2})(?:, |: )([\s\S]*)$/;
    var TITLE_RE = /^(.+?) (?:님과 )?카카오톡 대화$/;
    var SAVED_RE = /^저장한 날짜 : (.+)$/;

    var SYS_VERB = /(초대했습니다|추가했습니다|제거했습니다|내보냈습니다|들어왔습니다|나갔습니다|입장했습니다|퇴장했습니다|부방장이 되었습니다|부방장에서 해제되었습니다|방장이 되었습니다|시작했어요!?)\.?$/;
    var SYS_FIXED = [
        [/^메시지가 삭제되었습니다\.$/, 'deleted'],
        [/^관리자가 메시지를 가렸습니다\.$/, 'hidden'],
        [/^팀 이름이 변경되었습니다\.$/, 'rename'],
        [/^채팅방 이름이 변경되었습니다\.$/, 'rename']
    ];

    function stripNo(name) { return name.replace(/^\d{3,5}\s+(?=\S)/, ''); }

    /** Classifies one system line. Returns null if the line is not a system line. */
    function classifySystem(line) {
        var i;
        for (i = 0; i < SYS_FIXED.length; i++) if (SYS_FIXED[i][0].test(line)) return { type: SYS_FIXED[i][1] };
        if (line.length > 140 || !SYS_VERB.test(line)) return null;
        var m = /^(?:\d{3,5} )?(.{1,40}?)님(?:이|께서) (.*)$/.exec(line);
        if (!m) {
            m = /^(?:\d{3,5} )?(.{1,40}?)님을 (내보냈습니다)\.?$/.exec(line);
            if (m) return { type: 'kick', actor: '', targets: [m[1]] };
            return null;
        }
        var actor = m[1], rest = m[2], t;
        if ((t = /^(.+?)(?:을|를) 초대했습니다\.?$/.exec(rest))) return { type: 'invite', actor: actor, targets: splitNames(t[1]) };
        if ((t = /^(.+?)님을 내보냈습니다\.?$/.exec(rest))) return { type: 'kick', actor: actor, targets: [t[1]] };
        if ((t = /^(.+?)(?:을|를) 추가했습니다\.?$/.exec(rest))) return { type: 'add', actor: actor, targets: [t[1]] };
        if ((t = /^(.+?)(?:을|를) 제거했습니다\.?$/.exec(rest))) return { type: 'remove', actor: actor, targets: [t[1]] };
        if (/^들어왔습니다|^입장했습니다/.test(rest)) return { type: 'join', actor: actor, targets: [actor] };
        if (/^나갔습니다|^퇴장했습니다/.test(rest)) return { type: 'leave', actor: actor, targets: [actor] };
        if (/부방장|방장/.test(rest)) return { type: 'admin', actor: actor, targets: [actor] };
        return { type: 'other', actor: actor, targets: [] };
    }

    function splitNames(s) {
        return s.split(/님?, ?/).map(function (x) { return x.replace(/님$/, '').trim(); }).filter(Boolean);
    }

    /** Maps the text of a message to {kind, num}. */
    function classifyMessage(text) {
        if (text.length > 60) return { kind: KIND.TEXT, num: 0 };
        var m;
        if (text === '사진' || text === '사진을 보냈습니다.') return { kind: KIND.PHOTO, num: 1 };
        if ((m = /^사진 (\d+)장$/.exec(text))) return { kind: KIND.PHOTO, num: +m[1] };
        if (text === '이모티콘' || text === '(이모티콘)') return { kind: KIND.EMOTICON, num: 0 };
        if (text === '동영상' || text === '동영상을 보냈습니다.') return { kind: KIND.VIDEO, num: 0 };
        if (text.indexOf('파일: ') === 0) return { kind: KIND.FILE, num: 0 };
        if (text.indexOf('샵검색: ') === 0) return { kind: KIND.SEARCH, num: 0 };
        if (text === '음성메시지') return { kind: KIND.VOICE, num: 0 };
        if (text === '삭제된 메시지입니다.') return { kind: KIND.DELETED, num: 0 };
        return { kind: KIND.TEXT, num: 0 };
    }

    function toHour(ampm, h) {
        h = +h % 12;
        return ampm === '오후' ? h + 12 : h;
    }

    function newChat(fileName) {
        return {
            file: fileName || '', title: '', savedAt: '', format: 'pc',
            names: [], nameIdx: Object.create(null),
            ts: [], who: [], kind: [], num: [], text: [],
            events: [], deleted: 0, hidden: 0
        };
    }

    function nameId(chat, raw) {
        var id = chat.nameIdx[raw];
        if (id === undefined) { id = chat.names.length; chat.names.push(raw); chat.nameIdx[raw] = id; }
        return id;
    }

    function push(chat, ts, raw, text) {
        var c = classifyMessage(text);
        chat.ts.push(ts);
        chat.who.push(nameId(chat, raw));
        chat.kind.push(c.kind);
        chat.num.push(c.num);
        chat.text.push(text);
    }

    function pushEvent(chat, ts, sys) {
        if (sys.type === 'deleted') { chat.deleted++; return; }
        if (sys.type === 'hidden') { chat.hidden++; return; }
        chat.events.push({ ts: ts, type: sys.type, actor: sys.actor || '', targets: sys.targets || [] });
    }

    function detectFormat(lines) {
        var n = Math.min(lines.length, 400), i;
        if (lines[0] && /^﻿?"?Date"?,"?User"?,"?Message"?/i.test(lines[0])) return 'csv';
        for (i = 0; i < n; i++) {
            if (PC_DATE.test(lines[i]) || PC_MSG.test(lines[i])) return 'pc';
            if (MOBILE_MSG.test(lines[i])) return 'mobile';
        }
        return null;
    }

    function parsePc(lines, chat, onProgress) {
        var curTs = 0, cur = -1, y = 0, mo = 0, d = 0, i, line, m, sys, total = lines.length;
        for (i = 0; i < total; i++) {
            line = lines[i];
            if (line.charCodeAt(line.length - 1) === 13) line = line.slice(0, -1);
            if (line.charCodeAt(0) === 91 && (m = PC_MSG.exec(line))) {
                curTs = new Date(y, mo - 1, d, toHour(m[2], m[3]), +m[4]).getTime();
                push(chat, curTs, m[1], m[5]);
                cur = chat.text.length - 1;
            } else if (line.charCodeAt(0) === 45 && (m = PC_DATE.exec(line))) {
                y = +m[1]; mo = +m[2]; d = +m[3]; cur = -1;
            } else if ((sys = classifySystem(line))) {
                pushEvent(chat, curTs || new Date(y, mo - 1, d).getTime(), sys);
                cur = -1;
            } else if (cur >= 0) {
                chat.text[cur] += '\n' + line;
            } else if (!chat.title && (m = TITLE_RE.exec(line))) {
                chat.title = m[1];
            } else if ((m = SAVED_RE.exec(line))) {
                chat.savedAt = m[1];
            }
            if (onProgress && (i & 0x7fff) === 0) onProgress(i / total);
        }
        if (!chat.title) {
            for (i = 0; i < Math.min(lines.length, 6); i++) if ((m = TITLE_RE.exec(lines[i].replace(/\r$/, '')))) { chat.title = m[1]; break; }
        }
    }

    function parseMobile(lines, chat, onProgress) {
        var cur = -1, i, line, m, sys, total = lines.length, ts, lastTs = 0;
        for (i = 0; i < total; i++) {
            line = lines[i];
            if (line.charCodeAt(line.length - 1) === 13) line = line.slice(0, -1);
            if ((m = MOBILE_MSG.exec(line))) {
                ts = lastTs = new Date(+m[1], m[2] - 1, +m[3], toHour(m[4], m[5]), +m[6]).getTime();
                push(chat, ts, m[7], m[8]);
                cur = chat.text.length - 1;
            } else if (MOBILE_DATE.test(line)) {
                if (cur >= 0) chat.text[cur] = chat.text[cur].replace(/\n+$/, '');
                cur = -1;
            } else if ((sys = classifySystem(line)) && (sys.type === 'deleted' || sys.type === 'hidden')) {
                pushEvent(chat, lastTs, sys);
            } else if ((m = MOBILE_SYS.exec(line)) && (sys = classifySystem(m[7]))) {
                pushEvent(chat, new Date(+m[1], m[2] - 1, +m[3], toHour(m[4], m[5]), +m[6]).getTime(), sys);
                cur = -1;
            } else if (cur >= 0) {
                chat.text[cur] += '\n' + line;
            } else if (!chat.title && (m = TITLE_RE.exec(line))) {
                chat.title = m[1];
            } else if ((m = SAVED_RE.exec(line))) {
                chat.savedAt = m[1];
            }
            if (onProgress && (i & 0x7fff) === 0) onProgress(i / total);
        }
    }

    function csvRows(text) {
        var rows = [], row = [], field = '', q = false, i, c, n = text.length;
        for (i = 0; i < n; i++) {
            c = text[i];
            if (q) {
                if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
                else field += c;
            } else if (c === '"') q = true;
            else if (c === ',') { row.push(field); field = ''; }
            else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
            else if (c !== '\r') field += c;
        }
        if (field || row.length) { row.push(field); rows.push(row); }
        return rows;
    }

    function parseCsv(text, chat) {
        var rows = csvRows(text.replace(/^﻿/, '')), i, m, ts;
        for (i = 1; i < rows.length; i++) {
            if (rows[i].length < 3) continue;
            m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/.exec(rows[i][0]);
            if (!m) continue;
            ts = new Date(+m[1], m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0)).getTime();
            push(chat, ts, rows[i][1], rows[i].slice(2).join(','));
        }
    }

    /** Parses one exported file. Throws an Error with a user-readable message if the format is unknown. */
    function parseChat(text, fileName, onProgress) {
        var lines = text.replace(/^﻿/, '').split('\n');
        var format = detectFormat(lines);
        if (!format) throw new Error('카카오톡 대화 내보내기 형식이 아니에요: ' + (fileName || '파일'));
        var chat = newChat(fileName);
        chat.format = format;
        if (format === 'pc') parsePc(lines, chat, onProgress);
        else if (format === 'mobile') parseMobile(lines, chat, onProgress);
        else parseCsv(text, chat);
        if (!chat.ts.length) throw new Error('메시지를 찾지 못했어요: ' + (fileName || '파일'));
        if (!chat.title) chat.title = (fileName || '대화').replace(/\.[^.]+$/, '');
        return chat;
    }

    return { KIND: KIND, parseChat: parseChat, classifySystem: classifySystem, classifyMessage: classifyMessage, stripNo: stripNo };
});
