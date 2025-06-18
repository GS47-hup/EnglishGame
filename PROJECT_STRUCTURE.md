# PROJECT STRUCTURE

**Last Updated:** 2025-06-18 21:59:03  
**Project:** English Review Game  
**Purpose:** Document all folders and files and their purposes

---

## 📁 ROOT DIRECTORY STRUCTURE

```
Review game/
├── 📄 CORE APPLICATION FILES
│   ├── index.html                      # Main game interface (2041 lines)
│   ├── app.js                         # JavaScript functionality (3116 lines)
│   └── questions.json                 # Vocabulary and questions database (797 lines)
│
├── 📚 VOCABULARY & CONTENT
│   ├── VOCAB.md                       # AUTHORITATIVE vocabulary source (58 words ONLY)
│   ├── All first month vocab and sentecnes.md  # Extended vocabulary reference
│   └── comprehensive_question_bank.md # Question templates and formats
│
├── 📊 ASSESSMENT SYSTEM
│   ├── Month_1_Exam_Teacher_Guide.md  # Complete assessment administration guide
│   └── 1st month exam format/         # Directory with 60 exam questions (5 sections)
│
├── 📋 PROJECT MANAGEMENT FILES
│   ├── CHANGELOG.md                   # Project change history (671+ lines)
│   ├── CONTEXT_WINDOW_BRIEFING.md     # Essential briefing for new chat sessions
│   ├── PROJECT_STRUCTURE.md           # This file - complete file documentation
│   ├── TODO.md                        # Task tracking and priorities
│   ├── SESSION_SUMMARY.md             # Work session summaries
│   ├── PROJECT_OVERVIEW.md            # Project description and goals
│   └── PROJECT_MANAGEMENT_TEMPLATE.md # Template for future projects
│
├── 📖 DOCUMENTATION & GUIDES
│   ├── README.md                      # User-facing documentation (175 lines)
│   ├── content_bank_guide.md          # Content management instructions
│   ├── vocabulary_image_guide.md      # Visual vocabulary guidance
│   └── words_needing_images.md        # Image priority tracking
│
├── 🔧 DEVELOPMENT & AUTOMATION
│   ├── start_server.py                # Python development server (56 lines)
│   ├── start_game.bat                 # Windows launcher script (24 lines)
│   ├── generate_questions.js          # Question generation utility
│   └── generate_complete_questions.py # Assessment generation script (339 lines)
│
├── 🐛 DEBUGGING & ISSUE TRACKING
│   ├── ISSUE_LOG.md                   # Current problems & solutions (227 lines)
│   ├── debug_section1.html            # Section-specific debugging (119 lines)
│   ├── SECTION4_FIXES.md              # Specific section fixes
│   └── assessment_enhancement_suggestions.md # Improvement suggestions
│
├── 📊 LEARNING & ANALYSIS
│   ├── my_learning_log.md             # Development learning notes
│   └── expanded_review_game.html      # Alternative game version
│
├── 🔄 VERSION CONTROL
│   ├── .git/                          # Git repository data
│   └── .gitignore                     # Git ignore patterns
│
└── 📁 ARCHIVED/LEGACY
    ├── Month 1 Exam Practice_ Interactive Review Game.html    # Legacy version
    └── Month 1 Exam Practice_ Interactive Review Game_files/  # Legacy assets
```

---

## 📄 CRITICAL FILES DETAILED

### **Core Application (DO NOT MODIFY WITHOUT TESTING)**
- **`index.html`** (2041 lines)
  - Main game interface
  - Contains all HTML structure
  - Integrated CSS and some JavaScript
  - CRITICAL: Test thoroughly after any changes

- **`app.js`** (3116 lines) 
  - All JavaScript functionality
  - FlashcardsGame class implementation
  - Question type handlers
  - Audio system and navigation

- **`questions.json`** (797 lines)
  - Complete vocabulary database
  - All question types and content
  - MUST validate JSON syntax after edits

### **Vocabulary Authority**
- **`VOCAB.md`** (202 lines)
  - **AUTHORITATIVE SOURCE** - Only 58 words allowed
  - All questions MUST use only these words
  - NO EXCEPTIONS - do not add vocabulary

### **Assessment System**
- **`Month_1_Exam_Teacher_Guide.md`** (188 lines)
  - Complete teacher instructions
  - Audio scripts and answer keys
  - Professional assessment guidance

- **`1st month exam format/`**
  - Section 1: 20 line-matching questions
  - Section 2: 10 action matching
  - Section 3: 10 multiple choice
  - Section 4: 10 yes/no questions
  - Section 5: 10 preposition questions

---

## 📋 PROJECT MANAGEMENT FILES PURPOSE

### **CHANGELOG.md** ✅ EXISTS
- **Purpose:** Track all project changes chronologically
- **Update:** After every modification
- **Current:** 671+ lines documenting versions 2.0.0 - 2.5.0

### **CONTEXT_WINDOW_BRIEFING.md** ✅ EXISTS  
- **Purpose:** Essential briefing for new chat sessions
- **Update:** Frequently per session
- **Content:** Current state, constraints, next steps

### **PROJECT_STRUCTURE.md** ✅ THIS FILE
- **Purpose:** Document all files and their purposes
- **Update:** When file/folder structure changes
- **Content:** Complete directory tree with descriptions

### **TODO.md** ⏳ TO BE CREATED
- **Purpose:** Track tasks by priority
- **Update:** Daily/per session
- **Organization:** High/Medium/Low priority sections

### **SESSION_SUMMARY.md** ⏳ TO BE CREATED
- **Purpose:** Remember work between sessions
- **Update:** End of each session
- **Content:** Accomplishments, decisions, next steps

### **PROJECT_OVERVIEW.md** ⏳ TO BE CREATED
- **Purpose:** Explain project background and goals
- **Update:** When scope changes
- **Content:** Description, background, stakeholders

### **PROJECT_MANAGEMENT_TEMPLATE.md** ⏳ TO BE CREATED
- **Purpose:** Template for future projects
- **Content:** User's original instructions
- **Benefit:** Consistency across projects

---

## 🔄 FILE CHANGE TRACKING

### **Recently Modified (Version 2.5.0)**
- `CHANGELOG.md` - Updated with latest features (2025-06-16)
- `Month_1_Exam_Teacher_Guide.md` - Complete teacher guide created
- `CONTEXT_WINDOW_BRIEFING.md` - New essential briefing file
- `index.html` - Assessment preview section added
- `app.js` - FlashcardsGame class implementation

### **Stable Core Files**
- `questions.json` - Vocabulary database (stable)
- `VOCAB.md` - Authoritative word list (58 words, stable)
- `start_server.py` - Development server (stable)
- `README.md` - User documentation (stable)

### **Development Files**
- `debug_section1.html` - Section debugging tool
- `generate_complete_questions.py` - Assessment generation
- `ISSUE_LOG.md` - Problem tracking and solutions

---

## 📊 FILE SIZE & COMPLEXITY MONITORING

### **Large Files (>1000 lines)**
1. **`index.html`** - 2041 lines (main interface)
2. **`app.js`** - 3116 lines (core functionality)  
3. **`questions.json`** - 797 lines (data)
4. **`CHANGELOG.md`** - 671+ lines (history)

### **Medium Files (100-999 lines)**
- `generate_complete_questions.py` - 339 lines
- `ISSUE_LOG.md` - 227 lines
- `Month_1_Exam_Teacher_Guide.md` - 188 lines
- `README.md` - 175 lines

### **Small Files (<100 lines)**
- Most documentation and utility files
- Configuration and startup scripts
- Specific debugging tools

---

## 🚨 CRITICAL FILE RULES

### **NEVER MODIFY WITHOUT BACKUP**
- `index.html` - Main game interface
- `app.js` - Core JavaScript functionality
- `questions.json` - Vocabulary database
- `VOCAB.md` - Authoritative vocabulary

### **ALWAYS VALIDATE AFTER CHANGES**
- JSON syntax in `questions.json`
- Vocabulary compliance against `VOCAB.md`
- Game functionality testing
- Cross-browser compatibility

### **UPDATE DOCUMENTATION WHEN CHANGING**
- Add to `CHANGELOG.md` for all changes
- Update this file when structure changes
- Update `CONTEXT_WINDOW_BRIEFING.md` for status changes
- Update `TODO.md` for new tasks

---

## 📁 DIRECTORY PURPOSES

### **`1st month exam format/`**
- Contains all 60 assessment questions
- Organized by 5 sections
- Ready for teacher use
- Print-friendly format

### **`.git/`**
- Version control system
- Complete project history
- Branch and commit tracking
- Collaboration support

### **`Month 1 Exam Practice_ Interactive Review Game_files/`**
- Legacy assets from older version
- Supporting files for archived HTML
- Reference materials only

---

**File Structure Last Updated:** 2025-06-16 18:21:05  
**Total Files:** 25+ core files, multiple documentation files  
**Next Structure Review:** When new files added or major reorganization needed 