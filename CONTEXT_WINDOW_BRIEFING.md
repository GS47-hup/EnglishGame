# 🧠 Context Window Briefing - English Review Game

**Last Updated**: June 18, 2025  
**Version**: 2.15.0  
**Purpose**: Essential briefing for new chat sessions

---

## 📋 Project Overview

This is an **Interactive English Review Game** designed for ESL (English as Second Language) students, specifically targeting month-1 vocabulary and listening comprehension skills.

### 🎯 Core Components
- **Main Game**: `index.html` - Interactive vocabulary review with 8 question types
- **Flashcards System**: Integrated vocabulary practice with multiple study modes
- **Assessment System**: Complete 60-question month-end listening comprehension exam
- **Content Bank**: Dynamic vocabulary management system
- **Teacher Tools**: Comprehensive guides and assessment materials

---

## 📁 Critical Files Structure

### 🏗️ Core Application Files
- `index.html` - Main application (2041 lines)
- `app.js` - JavaScript functionality (3116 lines)
- `questions.json` - Vocabulary and question database (797 lines)

### 📝 Vocabulary & Content
- `VOCAB.md` - **AUTHORITATIVE** vocabulary source (58 words only)
- `All first month vocab and sentecnes.md` - Extended vocabulary reference
- `comprehensive_question_bank.md` - Question templates and formats

### 📊 Assessment Materials
- `Month_1_Exam_Teacher_Guide.md` - Complete assessment administration guide
- `1st month exam format/` - Directory with all 60 exam questions organized by sections

### 📖 Documentation
- `README.md` - User-facing documentation
- `CHANGELOG.md` - Comprehensive version history (671 lines)
- `content_bank_guide.md` - Content management instructions

---

## ⚠️ Critical Constraints & Rules

### 🎯 Vocabulary Compliance
- **ONLY use vocabulary from `VOCAB.md`** (58 words total)
- **NO unauthorized words** (e.g., "frog" was removed for not being in VOCAB.md)
- All questions must strictly adhere to taught vocabulary

### 🖨️ Technical Requirements
- **Black & white compatible** - no color-dependent functionality
- **Print-friendly** - all materials must work in printed format
- **Mobile responsive** - works on all device sizes
- **Offline capable** - no external dependencies for core functionality

### 📚 Educational Standards
- Questions test only **learned sentence patterns**
- **Pedagogically sound** - follows ESL teaching best practices
- **Age-appropriate** - designed for elementary ESL students
- **Assessment-ready** - meets professional evaluation standards

---

## 🎮 Game Architecture

### 8 Question Types
1. **Line Matching** - Connect vocabulary with images (4-column system)
2. **Multiple Choice** - Visual options with audio prompts
3. **Fill in the Blank** - Complete sentences with vocabulary
4. **True/False** - Statement verification
5. **Audio Recognition** - Listen and identify
6. **Category Sorting** - Group related vocabulary
7. **Sentence Building** - Construct proper sentences
8. **Action Matching** - Match subjects with actions

### 🃏 Flashcards System
- **10 Study Modes**: All vocab, Family, Colors, Body Parts, Animals, Food, School, Actions, Transport, Clothing
- **3 Card Styles**: Emoji→Word, Word→Emoji, Audio→Word
- **Features**: Auto-flip, navigation, progress tracking, shuffle

---

## 📊 Assessment System (60 Questions)

### Section Breakdown
- **Section 1**: 20 vocabulary line-matching (A/B columns with emojis)
- **Section 2**: 10 action matching (subjects performing actions)
- **Section 3**: 10 multiple choice (3 visual options per audio)
- **Section 4**: 10 yes/no questions (listening + visual aids)
- **Section 5**: 10 preposition questions (audio + 3 position choices)

---

## 🔧 Development Context

### Recent Major Updates (v2.5.0)
1. **Fixed Flashcards**: Complete JavaScript implementation
2. **Created Assessment**: 60-question professional exam
3. **Added Teacher Guide**: Comprehensive administration instructions
4. **Built Preview System**: Digital exam preview for teacher sharing
5. **Vocabulary Compliance**: Strict adherence to VOCAB.md only

### Known Working Features
- ✅ All 8 game question types functional
- ✅ Flashcards fully implemented
- ✅ Content Bank vocabulary management
- ✅ Assessment preview system
- ✅ Teacher guide complete

### Current Issues
- Check `ISSUE_LOG.md` for any ongoing problems
- Vocabulary images: Some words still use emojis (see `words_needing_images.md`)

---

## 🚀 Quick Start for New Sessions

### 1. First Priority Checks
- Read this briefing completely
- Check `CHANGELOG.md` for latest updates
- Review `ISSUE_LOG.md` for current problems
- Verify `VOCAB.md` for vocabulary constraints

### 2. Development Guidelines
- **NEVER** add vocabulary not in `VOCAB.md`
- **ALWAYS** test black & white compatibility
- **ALWAYS** update `CHANGELOG.md` when making changes
- **ALWAYS** commit and push changes with git

### 3. Common Tasks
- **Adding Questions**: Use templates from `comprehensive_question_bank.md`
- **Vocabulary Issues**: Check `VOCAB.md` for authorized words only
- **Assessment Work**: All materials in `1st month exam format/` folder
- **Debugging**: Check `debug_section1.html` for section-specific issues

---

## 📞 Key Contacts & Context

- **Target Users**: Elementary ESL students (month 1)
- **Primary Use**: Classroom review and assessment
- **Secondary Use**: Home practice and teacher training
- **Export Needs**: Print-ready materials for traditional classrooms

---

## 🔄 Version Control Notes

- Current version: **2.5.0** (June 16, 2025)
- Major milestone: Complete flashcards + assessment system
- Next priorities: Check user requests and `ISSUE_LOG.md`

---

**📌 Remember**: This project prioritizes educational effectiveness, vocabulary compliance, and print compatibility above all other features. 