# ISHS Lab

ISHS Lab is an integrated web-based academic platform designed to provide a comprehensive learning environment for mathematics, algorithms, and vocabulary management. The platform is optimized for user experience and learning efficiency, offering tools for continuous practice and evaluation.

## Key Modules

### 1. Integral Studio
An indefinite integral problem generation and verification system powered by Python's SymPy engine.
- **Dynamic Problem Generation:** Automatically generates indefinite integral problems across various difficulty levels in real-time.
- **Strict Validation:** Provides precise grading by mathematically evaluating the equivalence of expressions and strictly checking for the constant of integration (C).

### 2. Coding Test Studio
A comprehensive algorithmic library and practice environment for competitive programming.
- **Algorithm Archive:** Provides standard implementations for over 14 major algorithm categories, including Graph Theory, Dynamic Programming, and Greedy Algorithms.
- **Synchronization System:** Utilizes the `scripts/sync_algorithms.py` script to seamlessly parse local algorithm source files and reflect them on the web viewer.

### 3. Vocabulary Studio
A systematic vocabulary management tool designed for efficient memorization.
- **Customized Flashcards:** Allows users to create personal word lists and self-evaluate their progress through interactive testing interfaces.

## Project Structure

```text
ISHS_Lab/
├── index.php             # Main portal and landing page
├── modules.php           # Module selection interface
├── coding_test.php       # Algorithm viewer module
├── integral.php          # Integral practice module
├── vocabulary.php        # Vocabulary management module
├── data/
│   ├── algorithms/       # Algorithm source codes and categorizations
│   ├── math/             # Mathematics problem data
│   └── english/          # Vocabulary data
├── scripts/
│   ├── sync_algorithms.py# Synchronization tool for algorithm data
│   └── logic.js          # Core frontend logic for modules
└── assets/               # Static assets including CSS and images
```

## Requirements

- **PHP:** 7.0 or higher (Optimized for standard Apache environments)
- **Python:** 3.7 or higher (Required for algorithm data synchronization)

## Installation and Usage

1. Clone the repository to your local web server directory:
   ```bash
   git clone https://github.com/dohye0508/ISHS_Lab.git
   ```

2. Configure your web server to serve the root directory.

3. To synchronize or update the algorithm library data, execute the synchronization script:
   ```bash
   python scripts/sync_algorithms.py
   ```

## License

- **Developer:** Dohye Lee
- **Copyright:** © 2026 ISHS Lab. All Rights Reserved.
- **License:** MIT License
