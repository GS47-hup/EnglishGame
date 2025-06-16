// ================================
// ENGLISH REVIEW GAME - COMPLETE SYSTEM
// All critical fixes included
// ================================

// Global State Management
const AppState = {
    questionsData: null,
    currentSection: 'welcome',
    currentQuestion: 0,
    score: 0,
    audioEnabled: true,
    debugMode: true
};

// Content Bank & Local Storage
let contentBank = JSON.parse(localStorage.getItem('eslContentBank') || '{}');
let currentEditingTopic = null;

// Available sections
const sections = ['welcome', 'section1', 'section2', 'section3', 'section4', 'section5', 
                 'familyTree', 'colorSort', 'counting', 'numberGame', 'numberMatch', 
                 'foodGame', 'transportGame', 'actionGame', 'comprehensiveGame', 'flashcards', 'contentBank'];

// ================================
// TEACHER SELECTION SYSTEM
// ================================

class TeacherSelectionSystem {
    constructor() {
        this.currentTeacher = null;
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.showTeacherSelection();
    }
    
    attachEventListeners() {
        // Teacher selection buttons
        document.querySelectorAll('.teacher-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const teacher = e.currentTarget.dataset.teacher;
                this.selectTeacher(teacher);
            });
        });
        
        // Back to teacher selection buttons
        document.getElementById('back-to-teacher-selection')?.addEventListener('click', () => {
            this.showTeacherSelection();
        });
        
        document.getElementById('back-to-teacher-selection-2')?.addEventListener('click', () => {
            this.showTeacherSelection();
        });
    }
    
    selectTeacher(teacher) {
        this.currentTeacher = teacher;
        debugLog(`Teacher selected: ${teacher}`);
        
        if (teacher === 'barry') {
            this.showTeacherBarryGames();
        } else if (teacher === 'other') {
            this.showOtherGames();
        }
    }
    
    showTeacherSelection() {
        // Hide all containers
        document.getElementById('teacher-selection').style.display = 'block';
        document.getElementById('teacher-barry-container').style.display = 'none';
        document.getElementById('other-games-container').style.display = 'none';
        
        // Update current teacher
        this.currentTeacher = null;
        debugLog('Showing teacher selection screen');
    }
    
    showTeacherBarryGames() {
        // Hide teacher selection and other games
        document.getElementById('teacher-selection').style.display = 'none';
        document.getElementById('other-games-container').style.display = 'none';
        
        // Show Teacher Barry container
        document.getElementById('teacher-barry-container').style.display = 'block';
        
        debugLog('Showing Teacher Barry games');
    }
    
    showOtherGames() {
        // Hide teacher selection and Teacher Barry games
        document.getElementById('teacher-selection').style.display = 'none';
        document.getElementById('teacher-barry-container').style.display = 'none';
        
        // Show other games container
        document.getElementById('other-games-container').style.display = 'block';
        
        debugLog('Showing other games');
        
        // Initialize the questions loader if not already done
        if (!window.questionsLoader) {
            debugLog('Initializing questions loader for Other Games...');
            window.questionsLoader = new QuestionsLoader();
        }
        
        // Initialize the main navigation system for other games
        initializeMainNavigation();
        initializeGameNavigation();
        
        // Show welcome section
        showSection('welcome');
    }
    
    getCurrentTeacher() {
        return this.currentTeacher;
    }
}

// ================================
// UTILITY FUNCTIONS
// ================================

function debugLog(message, data = null) {
    if (AppState.debugMode) {
        console.log(`[DEBUG] ${message}`, data || '');
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ================================
// AUDIO SYSTEM
// ================================

class AudioSystem {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        this.currentVoice = null;
        this.enabled = true;
        this.init();
    }
    
    init() {
        try {
            if (this.synthesis) {
                this.loadVoices();
                this.synthesis.addEventListener('voiceschanged', () => this.loadVoices());
                debugLog('Audio system initialized successfully');
            }
        } catch (error) {
            console.error('Audio system initialization failed', error);
        }
    }
    
    loadVoices() {
        this.voices = this.synthesis.getVoices();
        this.currentVoice = this.voices.find(voice => 
            voice.lang.startsWith('en') && voice.localService
        ) || this.voices.find(voice => voice.lang.startsWith('en')) || this.voices[0];
        
        debugLog('Voices loaded', { 
            total: this.voices.length, 
            selected: this.currentVoice?.name 
        });
    }
    
    speak(text, options = {}) {
        if (!this.enabled || !this.synthesis || !text) return;
        
        try {
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = this.currentVoice;
            utterance.rate = options.rate || 0.8;
            utterance.pitch = options.pitch || 1;
            utterance.volume = options.volume || 1;
            
            utterance.onstart = () => debugLog(`Speaking: "${text}"`);
            utterance.onerror = (error) => console.error('Speech error', error);
            
            this.synthesis.speak(utterance);
        } catch (error) {
            console.error('Speech synthesis failed', error);
        }
    }
    
    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.synthesis.cancel();
        }
        return this.enabled;
    }
}

const audioSystem = new AudioSystem();

// ================================
// QUESTIONS LOADING SYSTEM
// ================================

class QuestionsLoader {
    constructor() {
        this.questionsData = null;
        this.loadQuestions();
    }
    
    async loadQuestions() {
        try {
            debugLog('Loading questions data...');
            const response = await fetch('questions.json');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            this.questionsData = await response.json();
            AppState.questionsData = this.questionsData;
            
            debugLog('Questions loaded successfully', {
                sections: Object.keys(this.questionsData).length,
                totalQuestions: this.getTotalQuestions(),
                section1Available: !!this.questionsData.section1,
                section1Questions: this.questionsData.section1?.questions?.length || 0
            });
            
            // Initialize sections after data is loaded
            this.initializeSections();
            showToast('Questions loaded successfully! 🎉', 'success');
            
        } catch (error) {
            console.error('Failed to load questions', error);
            this.createFallbackQuestions();
            this.initializeSections();
            showToast('Using fallback questions', 'info');
        }
    }
    
    getTotalQuestions() {
        if (!this.questionsData) return 0;
        return Object.values(this.questionsData).reduce((total, section) => 
            total + (section.questions?.length || 0), 0
        );
    }
    
    createFallbackQuestions() {
        debugLog('Creating fallback questions...');
        this.questionsData = {
            section1: {
                title: "Basic Vocabulary & Greetings",
                description: "Foundation vocabulary: Family, colors, greetings, body parts",
                questions: [
                    {
                        id: 1,
                        type: "multiple_choice",
                        question: "What do you say when you meet someone?",
                        options: ["Hello", "Red", "Cat", "Book"],
                        correct: 0,
                        emoji: "👋",
                        audio: "Hello"
                    },
                    {
                        id: 2,
                        type: "multiple_choice",
                        question: "What color is an apple?",
                        options: ["Blue", "Red", "Yellow", "Green"],
                        correct: 1,
                        emoji: "🍎",
                        audio: "Red"
                    },
                    {
                        id: 3,
                        type: "multiple_choice",
                        question: "Who is your father's father?",
                        options: ["Brother", "Sister", "Grandfather", "Uncle"],
                        correct: 2,
                        emoji: "👴",
                        audio: "Grandfather"
                    },
                    {
                        id: 4,
                        type: "multiple_choice",
                        question: "What do you use to see?",
                        options: ["Nose", "Ears", "Eyes", "Mouth"],
                        correct: 2,
                        emoji: "👀",
                        audio: "Eyes"
                    },
                    {
                        id: 5,
                        type: "multiple_choice",
                        question: "What color is the sun?",
                        options: ["Blue", "Red", "Yellow", "Green"],
                        correct: 2,
                        emoji: "☀️",
                        audio: "Yellow"
                    }
                ]
            },
            section2: {
                title: "Additional Practice",
                description: "Extra questions for practice",
                questions: [
                    {
                        id: 6,
                        type: "multiple_choice",
                        question: "What color is grass?",
                        options: ["Red", "Blue", "Green", "Purple"],
                        correct: 2,
                        emoji: "🌱",
                        audio: "Green"
                    }
                ]
            }
        };
        AppState.questionsData = this.questionsData;
        debugLog('Fallback questions created', {
            section1Questions: this.questionsData.section1.questions.length,
            totalSections: Object.keys(this.questionsData).length
        });
    }
    
    initializeSections() {
        if (!AppState.questionsData) {
            debugLog('No questions data available for section initialization');
            return;
        }
        
        const availableSections = Object.keys(AppState.questionsData);
        debugLog('Initializing sections:', availableSections);
        
        availableSections.forEach(sectionId => {
            try {
            this.renderSection(sectionId);
                debugLog(`Successfully rendered section: ${sectionId}`);
            } catch (error) {
                console.error(`Failed to render section ${sectionId}:`, error);
            }
        });
        
        debugLog('All sections initialized');
    }
    
    renderSection(sectionId) {
        const sectionElement = document.getElementById(sectionId);
        if (!sectionElement || !AppState.questionsData || !AppState.questionsData[sectionId]) {
            debugLog(`Cannot render section ${sectionId}: element or data missing`);
            return;
        }
        
        const sectionData = AppState.questionsData[sectionId];
        debugLog(`Rendering section: ${sectionId}`, sectionData);
        
        sectionElement.innerHTML = `
            <div class="section-header mb-6">
                <h2 class="text-3xl font-bold mb-2 text-blue-600">${sectionData.title}</h2>
                <p class="text-gray-600 mb-4">${sectionData.description}</p>
                <div class="bg-blue-50 p-4 rounded-lg">
                    <p class="text-blue-800"><strong>Questions:</strong> ${sectionData.questions.length}</p>
                    <div class="mt-4">
                        <button onclick="startSection('${sectionId}')" class="start-section-btn bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg">
                            ▶️ Start ${sectionData.title}
                        </button>
                        <button onclick="audioSystem.speak('${sectionData.title}')" class="ml-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition">
                            🔊 Play Audio
                        </button>
                    </div>
                </div>
            </div>
            <div id="${sectionId}-content" class="questions-container hidden">
                <!-- Questions will be rendered here -->
            </div>
        `;
    }
}

// ================================
// SECTION NAVIGATION SYSTEM
// ================================

function showSection(sectionId) {
    try {
        debugLog(`Navigating to section: ${sectionId}`);
        
        // Hide all sections
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
            AppState.currentSection = sectionId;
            
            debugLog(`Successfully showed section: ${sectionId}`);
            updateNavigationState(sectionId);
            
            // Handle special sections
            if (sectionId === 'contentBank') {
                initializeContentBank();
            }
            
            // Scroll to top
            window.scrollTo(0, 0);
            
        } else {
            console.error(`Section not found: ${sectionId}`);
        }
        
    } catch (error) {
        console.error('Navigation error', error);
    }
}

function updateNavigationState(activeSection) {
    try {
        // Update section buttons
        document.querySelectorAll('.section-btn').forEach(btn => {
            btn.classList.remove('bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });
        
        // Highlight active section button
        const activeBtn = document.querySelector(`[data-section="${activeSection}"]`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
            activeBtn.classList.add('bg-blue-500', 'text-white');
        }
        
        debugLog(`Navigation state updated for: ${activeSection}`);
    } catch (error) {
        console.error('Navigation state update failed', error);
    }
}

// ================================
// QUESTIONS SYSTEM
// ================================

function startSection(sectionId) {
    try {
        debugLog(`Attempting to start section: ${sectionId}`);
        
        if (!AppState.questionsData) {
            console.error('No questions data loaded yet');
            showToast('Questions are still loading, please wait...', 'error');
            return;
        }
        
        const sectionData = AppState.questionsData[sectionId];
        if (!sectionData) {
            console.error(`Section ${sectionId} not found in questions data`);
            console.log('Available sections:', Object.keys(AppState.questionsData));
            showToast(`Section ${sectionId} not found`, 'error');
            return;
        }
        
        if (!sectionData.questions || sectionData.questions.length === 0) {
            console.error(`No questions found for section: ${sectionId}`);
            showToast('No questions available for this section', 'error');
            return;
        }
        
        debugLog(`Starting section: ${sectionId}`, {
            title: sectionData.title,
            questionCount: sectionData.questions.length,
            firstQuestion: sectionData.questions[0]
        });
        
        AppState.currentQuestion = 0;
        AppState.score = 0;
        
        const contentContainer = document.getElementById(`${sectionId}-content`);
        if (!contentContainer) {
            console.error(`Content container ${sectionId}-content not found`);
            showToast('Section content area not found', 'error');
            return;
        }
        
            contentContainer.classList.remove('hidden');
            renderQuestion(sectionId, 0);
        
        // Hide section header temporarily
        const header = document.querySelector(`#${sectionId} .section-header`);
        if (header) {
            header.style.display = 'none';
        }
        
        debugLog(`Successfully started section: ${sectionId}`);
        
    } catch (error) {
        console.error('Failed to start section', error);
        showToast('Failed to start section', 'error');
    }
}

function renderQuestion(sectionId, questionIndex) {
    try {
        const sectionData = AppState.questionsData[sectionId];
        const question = sectionData.questions[questionIndex];
        
        if (!question) {
            showSectionResults(sectionId);
            return;
        }
        
        debugLog(`Rendering question ${questionIndex + 1}`, question);
        
        const contentContainer = document.getElementById(`${sectionId}-content`);
        
        let questionHTML = '';
        
        // Question counter and progress
        questionHTML += `
            <div class="question-progress mb-6">
                <div class="flex justify-between items-center mb-2">
                    <span class="question-counter bg-blue-600 text-white px-4 py-2 rounded-lg">Question ${questionIndex + 1} of ${sectionData.questions.length}</span>
                    <span class="score-display bg-green-600 text-white px-4 py-2 rounded-lg">Score: ${AppState.score}</span>
                </div>
                <div class="progress-bar bg-gray-200 rounded-full h-3">
                    <div class="progress-fill bg-blue-500 h-3 rounded-full transition-all" 
                         style="width: ${((questionIndex + 1) / sectionData.questions.length) * 100}%"></div>
                </div>
            </div>
        `;
        
        // Question content based on type
        if (question.type === 'multiple_choice') {
            questionHTML += renderMultipleChoiceQuestion(question, sectionId, questionIndex);
        } else if (question.type === 'yes_no') {
            questionHTML += renderYesNoQuestion(question, sectionId, questionIndex);
        } else if (question.type === 'matching') {
            questionHTML += renderMatchingQuestion(question, sectionId, questionIndex);
        } else if (question.type === 'drawing') {
            questionHTML += renderDrawingQuestion(question, sectionId, questionIndex);
        } else if (question.type === 'line_matching') {
            questionHTML += renderLineMatchingQuestion(question, sectionId, questionIndex);
        } else if (question.type === 'line_matching_columns') {
            questionHTML += renderLineMatchingColumnsQuestion(question, sectionId, questionIndex);
        } else if (question.type === 'subject_action_matching') {
            questionHTML += renderSubjectActionMatchingQuestion(question, sectionId, questionIndex);
        } else if (question.type === 'listen_and_circle') {
            questionHTML += renderListenAndCircleQuestion(question, sectionId, questionIndex);
        }
        
        // Navigation buttons
        questionHTML += `
            <div class="question-navigation mt-8 text-center">
                <button onclick="audioSystem.speak('${question.audio || question.question}')" 
                        class="audio-btn bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition mr-3 text-lg">
                    🔊 Play Audio
                </button>
                <button onclick="skipQuestion('${sectionId}', ${questionIndex})" 
                        class="skip-btn bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition text-lg">
                    ⏭️ Skip Question
                </button>
            </div>
        `;
        
        contentContainer.innerHTML = questionHTML;
        
        // Initialize special question types
        if (question.type === 'line_matching') {
            setTimeout(() => {
                initializeLineMatching(question);
            }, 100);
        } else if (question.type === 'line_matching_columns') {
            setTimeout(() => {
                initializeLineMatchingColumns(question);
            }, 100);
        } else if (question.type === 'subject_action_matching') {
            setTimeout(() => {
                initializeSubjectActionMatching(question);
            }, 100);
        } else if (question.type === 'listen_and_circle') {
            setTimeout(() => {
                initializeListenAndCircle(question);
            }, 100);
        }
        
        // Auto-play audio
        if (AppState.audioEnabled && question.audio) {
            setTimeout(() => audioSystem.speak(question.audio), 800);
        }
        
    } catch (error) {
        console.error('Question rendering failed', error);
        showToast('Failed to load question', 'error');
    }
}

function renderMultipleChoiceQuestion(question, sectionId, questionIndex) {
    return `
        <div class="question-container bg-white rounded-xl shadow-lg p-8">
            <div class="question-header text-center mb-8">
                <div class="question-emoji text-8xl mb-4">${question.emoji || '❓'}</div>
                <h3 class="question-text text-2xl font-bold mb-4 text-gray-800">${question.question}</h3>
            </div>
            <div class="options-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                ${question.options.map((option, index) => `
                    <button onclick="selectAnswer('${sectionId}', ${questionIndex}, ${index})" 
                            class="option-btn bg-blue-50 border-3 border-blue-300 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-100 transition-all text-xl font-semibold cursor-pointer hover:transform hover:scale-105">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function renderYesNoQuestion(question, sectionId, questionIndex) {
    return `
        <div class="question-container bg-white rounded-xl shadow-lg p-8">
            <div class="question-header text-center mb-8">
                <div class="question-emoji text-8xl mb-4">${question.emoji || '❓'}</div>
                <h3 class="question-text text-2xl font-bold mb-4 text-gray-800">${question.question}</h3>
            </div>
            <div class="yes-no-options flex justify-center gap-8">
                <button onclick="selectYesNo('${sectionId}', ${questionIndex}, true)" 
                        class="yes-btn bg-green-100 border-4 border-green-400 rounded-xl p-8 hover:bg-green-200 transition-all text-3xl font-bold cursor-pointer hover:transform hover:scale-105">
                    ✅ YES
                </button>
                <button onclick="selectYesNo('${sectionId}', ${questionIndex}, false)" 
                        class="no-btn bg-red-100 border-4 border-red-400 rounded-xl p-8 hover:bg-red-200 transition-all text-3xl font-bold cursor-pointer hover:transform hover:scale-105">
                    ❌ NO
                </button>
            </div>
        </div>
    `;
}

function renderMatchingQuestion(question, sectionId, questionIndex) {
    return `
        <div class="question-container bg-white rounded-xl shadow-lg p-8">
            <div class="question-header text-center mb-8">
                <h3 class="question-text text-2xl font-bold mb-4 text-gray-800">${question.question}</h3>
                <p class="instructions text-gray-600 text-lg">${question.instructions}</p>
            </div>
            <div class="matching-game grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="words-column">
                    <h4 class="font-bold mb-4 text-xl text-blue-600">Words:</h4>
                    <div class="word-items space-y-3">
                        ${question.pairs.map((pair, index) => `
                            <div class="word-item bg-blue-100 border-2 border-blue-300 rounded-lg p-4 cursor-move text-lg font-semibold" 
                                 draggable="true" data-word="${pair.word}" data-index="${index}">
                                ${pair.word}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="pictures-column">
                    <h4 class="font-bold mb-4 text-xl text-green-600">Pictures:</h4>
                    <div class="picture-slots space-y-3">
                        ${question.pairs.map((pair, index) => `
                            <div class="picture-slot drop-zone border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-20 bg-gray-50" 
                                 data-target="${pair.word}" data-index="${index}">
                                <div class="text-center">
                                    <span class="text-4xl">${pair.emoji}</span>
                                    <div class="text-sm text-gray-500 mt-2">Drop word here</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="matching-controls mt-8 text-center">
                <button onclick="checkMatching('${sectionId}', ${questionIndex})" 
                        class="check-btn bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg">
                    ✅ Check Answers
                </button>
            </div>
        </div>
    `;
}

function renderDrawingQuestion(question, sectionId, questionIndex) {
    return `
        <div class="question-container bg-white rounded-xl shadow-lg p-8">
            <div class="question-header text-center mb-8">
                <div class="question-emoji text-8xl mb-4">${question.emoji || '🎨'}</div>
                <h3 class="question-text text-2xl font-bold mb-4 text-gray-800">${question.question}</h3>
                <p class="instructions text-gray-600 text-lg">${question.instructions}</p>
            </div>
            <div class="drawing-area">
                <div class="drawing-tools text-center mb-6">
                    <button onclick="setDrawingTool('pen')" class="tool-btn bg-blue-500 text-white px-4 py-3 rounded-lg mr-2 hover:bg-blue-600">✏️ Pen</button>
                    <button onclick="setDrawingTool('eraser')" class="tool-btn bg-gray-500 text-white px-4 py-3 rounded-lg mr-2 hover:bg-gray-600">🧽 Eraser</button>
                    <button onclick="clearCanvas()" class="tool-btn bg-red-500 text-white px-4 py-3 rounded-lg mr-2 hover:bg-red-600">🗑️ Clear</button>
                    <input type="color" id="colorPicker" class="w-16 h-12 rounded border mr-2" value="#000000">
                </div>
                <canvas id="drawingCanvas" width="600" height="400" 
                        class="drawing-canvas border-4 border-gray-300 rounded-lg mx-auto block bg-white cursor-crosshair shadow-lg"></canvas>
            </div>
            <div class="drawing-controls mt-8 text-center">
                <button onclick="completeDrawing('${sectionId}', ${questionIndex})" 
                        class="complete-btn bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition font-semibold text-lg">
                    ✅ Complete Drawing
                </button>
            </div>
        </div>
    `;
}

function renderLineMatchingQuestion(question, sectionId, questionIndex) {
    const shuffledImages = question.shuffled_images_1.map(index => 
        question.images_1.find(img => img.id === index)
    );
    
    return `
        <div class="question-container bg-white rounded-xl shadow-lg p-8">
            <div class="question-header text-center mb-8">
                <div class="question-emoji text-8xl mb-4">${question.emoji || '🔗'}</div>
                <h3 class="question-text text-2xl font-bold mb-4 text-gray-800">${question.question}</h3>
                <p class="instructions text-gray-600 text-lg mb-4">${question.instructions}</p>
            </div>
            
            <div class="line-matching-container relative bg-gray-50 rounded-xl p-6" style="min-height: 600px;">
                <!-- SVG for drawing lines -->
                <svg id="linesSvg" class="absolute top-0 left-0 w-full h-full" style="pointer-events: none; z-index: 10;">
                </svg>
                
                <!-- Numbers Row (1-${question.number_range_1.end}) -->
                <div class="numbers-row mb-8">
                    <h4 class="font-bold mb-4 text-xl text-blue-600 text-center">Numbers:</h4>
                    <div class="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
                        ${Array.from({length: question.number_range_1.end - question.number_range_1.start + 1}, (_, i) => {
                            const num = question.number_range_1.start + i;
                            return `
                                <div class="number-item bg-blue-100 border-3 border-blue-400 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-200 transition-all" 
                                     data-number="${num}" data-type="number" id="number-${num}">
                                    <div class="text-3xl font-bold text-blue-800">${num}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <!-- Images Row -->
                <div class="images-row">
                    <h4 class="font-bold mb-4 text-xl text-green-600 text-center">Images:</h4>
                    <div class="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
                        ${shuffledImages.map((image, index) => `
                            <div class="image-item bg-green-100 border-3 border-green-400 rounded-lg p-4 text-center cursor-pointer hover:bg-green-200 transition-all" 
                                 data-image-id="${image.id}" data-type="image" id="image-${image.id}">
                                <div class="text-6xl mb-2">${image.emoji}</div>
                                <div class="text-sm text-gray-600">${image.color} ${image.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Audio Controls -->
            <div class="audio-controls mt-8 text-center">
                <div class="mb-6">
                    <button onclick="playAllInstructions('${sectionId}', ${questionIndex})" 
                            class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-lg mr-4">
                        🔊 Play All Instructions
                    </button>
                    <button onclick="playNextInstruction('${sectionId}', ${questionIndex})" 
                            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg">
                        ▶️ Play Next Instruction
                    </button>
                </div>
                <div id="current-instruction" class="text-lg font-semibold text-gray-700 mb-4">
                    Click "Play Next Instruction" to start
                </div>
                <div class="instruction-progress bg-gray-200 rounded-full h-3 max-w-md mx-auto">
                    <div id="instruction-progress-bar" class="bg-purple-500 h-3 rounded-full transition-all" style="width: 0%"></div>
                </div>
            </div>
            
            <!-- Line Drawing Controls -->
            <div class="line-controls mt-8 text-center">
                <button onclick="generateNewImages('${sectionId}', ${questionIndex})" 
                        class="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition text-lg mr-4">
                    🎲 New Images
                </button>
                <button onclick="clearAllLinesColumns()" 
                        class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition text-lg mr-4">
                    🗑️ Clear All Lines
                </button>
                <button onclick="checkLineMatchingColumns('${sectionId}', ${questionIndex})" 
                        class="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition text-lg font-semibold">
                    ✅ Check Both Sections
                </button>
            </div>
        </div>
    `;
}

function renderLineMatchingColumnsQuestion(question, sectionId, questionIndex) {
    // Get shuffled images for both sections
    const sectionAImages = question.section_a.shuffled_order.map(index => 
        question.section_a.images.find(img => img.id === index)
    );
    const sectionBImages = question.section_b.shuffled_order.map(index => 
        question.section_b.images.find(img => img.id === index)
    );
    
    return `
        <div class="question-container bg-white rounded-xl shadow-lg p-8">
            <div class="question-header text-center mb-8">
                <div class="question-emoji text-8xl mb-4">${question.emoji || '🔗'}</div>
                <h3 class="question-text text-2xl font-bold mb-4 text-gray-800">${question.question}</h3>
                <p class="instructions text-gray-600 text-lg mb-4">${question.instructions}</p>
            </div>
            
            <div class="columns-container relative bg-gray-50 rounded-xl p-6" style="min-height: 700px;">
                <!-- SVG for drawing lines -->
                <svg id="linesSvg" class="absolute top-0 left-0 w-full h-full" style="pointer-events: none; z-index: 10;">
                </svg>
                
                <!-- 4-Column Layout -->
                <div class="grid grid-cols-4 gap-6 h-full">
                    
                    <!-- Column 1: Numbers 1-10 -->
                    <div class="section-a-numbers">
                        <h4 class="font-bold mb-4 text-xl text-blue-600 text-center">${question.section_a.title}</h4>
                        <div class="space-y-3">
                            ${Array.from({length: 10}, (_, i) => {
                                const num = i + 1;
                                return `
                                    <div class="number-item bg-blue-100 border-3 border-blue-400 rounded-lg p-3 text-center cursor-pointer hover:bg-blue-200 transition-all" 
                                         data-number="${num}" data-type="number" data-section="a" id="number-a-${num}">
                                        <div class="text-2xl font-bold text-blue-800">${num}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <!-- Column 2: Images for Section A -->
                    <div class="section-a-images">
                        <h4 class="font-bold mb-4 text-xl text-green-600 text-center">Section A Images</h4>
                        <div class="space-y-3">
                            ${sectionAImages.map((image) => `
                                <div class="image-item bg-green-100 border-3 border-green-400 rounded-lg p-4 text-center cursor-pointer hover:bg-green-200 transition-all" 
                                     data-image-id="${image.id}" data-type="image" data-section="a" id="image-a-${image.id}">
                                    <div class="text-6xl">${image.emoji}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Column 3: Numbers 11-20 -->
                    <div class="section-b-numbers">
                        <h4 class="font-bold mb-4 text-xl text-purple-600 text-center">${question.section_b.title}</h4>
                        <div class="space-y-3">
                            ${Array.from({length: 10}, (_, i) => {
                                const num = i + 11;
                                return `
                                    <div class="number-item bg-purple-100 border-3 border-purple-400 rounded-lg p-3 text-center cursor-pointer hover:bg-purple-200 transition-all" 
                                         data-number="${num}" data-type="number" data-section="b" id="number-b-${num}">
                                        <div class="text-2xl font-bold text-purple-800">${num}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <!-- Column 4: Images for Section B -->
                    <div class="section-b-images">
                        <h4 class="font-bold mb-4 text-xl text-orange-600 text-center">Section B Images</h4>
                        <div class="space-y-3">
                            ${sectionBImages.map((image) => `
                                <div class="image-item bg-orange-100 border-3 border-orange-400 rounded-lg p-4 text-center cursor-pointer hover:bg-orange-200 transition-all" 
                                     data-image-id="${image.id}" data-type="image" data-section="b" id="image-b-${image.id}">
                                    <div class="text-6xl">${image.emoji}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Audio Controls -->
            <div class="audio-controls mt-8 text-center">
                <div class="mb-6 space-x-4">
                    <button onclick="playAllInstructionsColumns('${sectionId}', ${questionIndex})" 
                            class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-lg">
                        🔊 Play All Instructions (Both Sections)
                    </button>
                    <button onclick="playNextInstructionColumns('${sectionId}', ${questionIndex})" 
                            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg">
                        ▶️ Play Next Instruction
                    </button>
                </div>
                
                <div class="grid grid-cols-2 gap-6 mb-4">
                    <div class="section-a-audio">
                        <h5 class="font-bold text-blue-600 mb-2">Section A Progress</h5>
                        <div id="current-instruction-a" class="text-sm text-gray-700 mb-2">Ready to start Section A</div>
                        <div class="instruction-progress bg-gray-200 rounded-full h-2">
                            <div id="instruction-progress-a" class="bg-blue-500 h-2 rounded-full transition-all" style="width: 0%"></div>
                        </div>
                    </div>
                    <div class="section-b-audio">
                        <h5 class="font-bold text-purple-600 mb-2">Section B Progress</h5>
                        <div id="current-instruction-b" class="text-sm text-gray-700 mb-2">Ready to start Section B</div>
                        <div class="instruction-progress bg-gray-200 rounded-full h-2">
                            <div id="instruction-progress-b" class="bg-purple-500 h-2 rounded-full transition-all" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Line Drawing Controls -->
            <div class="line-controls mt-8 text-center">
                <button onclick="generateNewImages('${sectionId}', ${questionIndex})" 
                        class="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition text-lg mr-4">
                    🎲 New Images
                </button>
                <button onclick="clearAllLinesColumns()" 
                        class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition text-lg mr-4">
                    🗑️ Clear All Lines
                </button>
                <button onclick="checkLineMatchingColumns('${sectionId}', ${questionIndex})" 
                        class="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition text-lg font-semibold">
                    ✅ Check Both Sections
                </button>
            </div>
        </div>
    `;
}

// ================================
// ANSWER PROCESSING
// ================================

function selectAnswer(sectionId, questionIndex, selectedOption) {
    try {
        const question = AppState.questionsData[sectionId].questions[questionIndex];
        const isCorrect = selectedOption === question.correct;
        
        debugLog(`Answer selected: ${selectedOption}, Correct: ${question.correct}`, { isCorrect });
        
        // Visual feedback
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach((btn, index) => {
            btn.disabled = true;
            btn.style.pointerEvents = 'none';
            if (index === question.correct) {
                btn.classList.add('bg-green-500', 'text-white', 'border-green-500');
            } else if (index === selectedOption && !isCorrect) {
                btn.classList.add('bg-red-500', 'text-white', 'border-red-500');
            }
        });
        
        // Audio feedback
        if (isCorrect) {
            AppState.score++;
            audioSystem.speak('Correct! Well done!');
            showToast('Correct! 🎉', 'success');
        } else {
            audioSystem.speak('Try again. The correct answer is ' + question.options[question.correct]);
            showToast('Try again! 🤔', 'error');
        }
        
        // Proceed to next question
        setTimeout(() => {
            nextQuestion(sectionId);
        }, 2500);
        
    } catch (error) {
        console.error('Answer processing failed', error);
    }
}

function selectYesNo(sectionId, questionIndex, answer) {
    try {
        const question = AppState.questionsData[sectionId].questions[questionIndex];
        const isCorrect = answer === question.correct;
        
        debugLog(`Yes/No answer: ${answer}, Correct: ${question.correct}`, { isCorrect });
        
        // Visual feedback
        const yesBtn = document.querySelector('.yes-btn');
        const noBtn = document.querySelector('.no-btn');
        
        yesBtn.disabled = true;
        noBtn.disabled = true;
        yesBtn.style.pointerEvents = 'none';
        noBtn.style.pointerEvents = 'none';
        
        if (question.correct) {
            yesBtn.classList.add('bg-green-500', 'text-white', 'border-green-500');
        } else {
            noBtn.classList.add('bg-green-500', 'text-white', 'border-green-500');
        }
        
        if (answer !== question.correct) {
            if (answer) {
                yesBtn.classList.add('bg-red-500', 'text-white', 'border-red-500');
            } else {
                noBtn.classList.add('bg-red-500', 'text-white', 'border-red-500');
            }
        }
        
        // Score and feedback
        if (isCorrect) {
            AppState.score++;
            audioSystem.speak('Correct!');
            showToast('Correct! 🎉', 'success');
        } else {
            audioSystem.speak('That is not correct. The answer is ' + (question.correct ? 'Yes' : 'No'));
            showToast('Try again! 🤔', 'error');
        }
        
        setTimeout(() => {
            nextQuestion(sectionId);
        }, 2500);
        
    } catch (error) {
        console.error('Yes/No processing failed', error);
    }
}

function nextQuestion(sectionId) {
    AppState.currentQuestion++;
    const sectionData = AppState.questionsData[sectionId];
    
    if (AppState.currentQuestion < sectionData.questions.length) {
        renderQuestion(sectionId, AppState.currentQuestion);
    } else {
        showSectionResults(sectionId);
    }
}

function skipQuestion(sectionId, questionIndex) {
    debugLog(`Skipping question ${questionIndex + 1}`);
    showToast('Question skipped', 'info');
    nextQuestion(sectionId);
}

function showSectionResults(sectionId) {
    try {
        const sectionData = AppState.questionsData[sectionId];
        const totalQuestions = sectionData.questions.length;
        const percentage = Math.round((AppState.score / totalQuestions) * 100);
        
        debugLog(`Section completed: ${sectionId}`, {
            score: AppState.score,
            total: totalQuestions,
            percentage
        });
        
        const contentContainer = document.getElementById(`${sectionId}-content`);
        
        let resultHTML = `
            <div class="results-container text-center bg-white rounded-xl shadow-lg p-8">
                <div class="results-header mb-8">
                    <div class="text-8xl mb-4">🎉</div>
                    <h2 class="text-4xl font-bold text-green-600 mb-4">Section Complete!</h2>
                </div>
                
                <div class="score-display bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 shadow-lg mb-8">
                    <div class="text-6xl font-bold text-blue-600 mb-2">${AppState.score}</div>
                    <div class="text-xl text-gray-600 mb-4">out of ${totalQuestions} questions</div>
                    <div class="text-4xl font-bold ${percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}">${percentage}%</div>
                </div>
                
                <div class="performance-message mb-8">
                    ${getPerformanceMessage(percentage)}
                </div>
                
                <div class="results-actions space-x-4">
                    <button onclick="restartSection('${sectionId}')" class="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition text-lg font-semibold">
                        🔄 Try Again
                    </button>
                    <button onclick="showSection('welcome')" class="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition text-lg font-semibold">
                        🏠 Home
                    </button>
                    <button onclick="goToNextSection('${sectionId}')" class="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition text-lg font-semibold">
                        ➡️ Next Section
                    </button>
                </div>
            </div>
        `;
        
        contentContainer.innerHTML = resultHTML;
        
        // Audio celebration
        if (percentage >= 80) {
            audioSystem.speak('Excellent work! You did great!');
        } else if (percentage >= 60) {
            audioSystem.speak('Good job! Keep practicing!');
        } else {
            audioSystem.speak('Keep trying! You can do better!');
        }
        
    } catch (error) {
        console.error('Results display failed', error);
    }
}

function getPerformanceMessage(percentage) {
    if (percentage >= 90) return '<div class="text-xl text-green-600">🌟 Outstanding! Perfect work!</div>';
    if (percentage >= 80) return '<div class="text-xl text-green-600">🎉 Excellent! Great job!</div>';
    if (percentage >= 70) return '<div class="text-xl text-blue-600">👍 Good work! Well done!</div>';
    if (percentage >= 60) return '<div class="text-xl text-yellow-600">📚 Keep practicing!</div>';
    return '<div class="text-xl text-red-600">💪 Try again! You can do it!</div>';
}

function restartSection(sectionId) {
    AppState.currentQuestion = 0;
    AppState.score = 0;
    startSection(sectionId);
}

function goToNextSection(currentSectionId) {
    const sectionOrder = ['section1', 'section2', 'section3', 'section4', 'section5'];
    const currentIndex = sectionOrder.indexOf(currentSectionId);
    
    if (currentIndex >= 0 && currentIndex < sectionOrder.length - 1) {
        const nextSection = sectionOrder[currentIndex + 1];
        showSection(nextSection);
    } else {
        showSection('welcome');
    }
}

// ================================
// DRAWING SYSTEM
// ================================

let drawingContext = null;
let isDrawing = false;
let currentTool = 'pen';

function initializeDrawingSystem() {
    const canvas = document.getElementById('drawingCanvas');
    if (!canvas) return;
    
    drawingContext = canvas.getContext('2d');
    drawingContext.lineWidth = 4;
    drawingContext.lineCap = 'round';
    drawingContext.strokeStyle = '#000000';
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing || !drawingContext) return;
    
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    drawingContext.lineTo(x, y);
    drawingContext.stroke();
    drawingContext.beginPath();
    drawingContext.moveTo(x, y);
}

function stopDrawing() {
    if (isDrawing) {
        drawingContext.beginPath();
        isDrawing = false;
    }
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                     e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    e.target.dispatchEvent(mouseEvent);
}

function setDrawingTool(tool) {
    currentTool = tool;
    
    if (tool === 'eraser') {
        drawingContext.globalCompositeOperation = 'destination-out';
        drawingContext.lineWidth = 20;
    } else {
        drawingContext.globalCompositeOperation = 'source-over';
        drawingContext.lineWidth = 4;
        const colorPicker = document.getElementById('colorPicker');
        if (colorPicker) {
            drawingContext.strokeStyle = colorPicker.value;
        }
    }
}

function clearCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    if (drawingContext && canvas) {
        drawingContext.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function completeDrawing(sectionId, questionIndex) {
    debugLog('Drawing completed');
    showToast('Drawing completed! 🎨', 'success');
    setTimeout(() => {
        nextQuestion(sectionId);
    }, 1500);
}

// ================================
// DRAG AND DROP SYSTEM
// ================================

function initializeDragAndDrop() {
    document.addEventListener('dragstart', function(e) {
        if (e.target.draggable) {
            e.dataTransfer.setData('text/plain', e.target.dataset.word || e.target.textContent);
            e.dataTransfer.setData('application/x-source-id', e.target.dataset.index || Math.random().toString());
            e.target.style.opacity = '0.5';
            debugLog('Drag started', e.target);
        }
    });
    
    document.addEventListener('dragend', function(e) {
        if (e.target.draggable) {
            e.target.style.opacity = '1';
        }
    });
    
    document.addEventListener('dragover', function(e) {
        if (e.target.classList.contains('drop-zone') || e.target.closest('.drop-zone')) {
            e.preventDefault();
            const dropZone = e.target.classList.contains('drop-zone') ? e.target : e.target.closest('.drop-zone');
            dropZone.classList.add('bg-blue-100', 'border-blue-400');
        }
    });
    
    document.addEventListener('dragleave', function(e) {
        if (e.target.classList.contains('drop-zone')) {
            e.target.classList.remove('bg-blue-100', 'border-blue-400');
        }
    });
    
    document.addEventListener('drop', function(e) {
        const dropZone = e.target.classList.contains('drop-zone') ? e.target : e.target.closest('.drop-zone');
        if (dropZone) {
            e.preventDefault();
            dropZone.classList.remove('bg-blue-100', 'border-blue-400');
            
            const data = e.dataTransfer.getData('text/plain');
            const sourceIndex = e.dataTransfer.getData('application/x-source-id');
            
            handleDrop(dropZone, data, sourceIndex);
        }
    });
}

function handleDrop(dropZone, data, sourceIndex) {
    debugLog('Drop handled', { dropZone, data, sourceIndex });
    
    // Add visual feedback
    const feedback = document.createElement('div');
    feedback.textContent = data;
    feedback.className = 'dropped-item bg-green-100 border-2 border-green-400 rounded-lg p-2 mb-2 text-center font-semibold';
    dropZone.appendChild(feedback);
    
    // Remove original item
    const sourceElement = document.querySelector(`[data-index="${sourceIndex}"]`);
    if (sourceElement) {
        sourceElement.style.display = 'none';
    }
    
    showToast(`Matched: ${data}`, 'success');
}

function checkMatching(sectionId, questionIndex) {
    showToast('Great job matching! 🎉', 'success');
    setTimeout(() => {
        nextQuestion(sectionId);
    }, 1500);
}

// ================================
// CONTENT BANK SYSTEM
// ================================

function initializeContentBank() {
    try {
        debugLog('Initializing Content Bank');
        updateTopicSelectors();
        
    } catch (error) {
        console.error('Content Bank initialization failed', error);
    }
}

function updateTopicSelectors() {
    // Simple implementation for now
    debugLog('Topic selectors updated');
}

// ================================
// SECTION 1 SPECIFIC FIXES
// ================================

function ensureSection1Loaded() {
    debugLog('Ensuring Section 1 is properly loaded...');
    
    // Check if Section 1 data exists
    if (!AppState.questionsData || !AppState.questionsData.section1) {
        console.error('Section 1 data not found');
        return false;
    }
    
    // Check if Section 1 DOM element exists
    const section1Element = document.getElementById('section1');
    if (!section1Element) {
        console.error('Section 1 DOM element not found');
        return false;
    }
    
    // Check if Section 1 has been rendered
    const currentContent = section1Element.innerHTML.trim();
    if (currentContent === '<div class="loading">Loading Section 1 questions...</div>' || currentContent === '') {
        debugLog('Section 1 not rendered, forcing render...');
        
        // Force render Section 1
        const sectionData = AppState.questionsData.section1;
        section1Element.innerHTML = `
            <div class="section-header mb-6">
                <h2 class="text-3xl font-bold mb-2 text-blue-600">${sectionData.title}</h2>
                <p class="text-gray-600 mb-4">${sectionData.description}</p>
                <div class="bg-blue-50 p-4 rounded-lg">
                    <p class="text-blue-800"><strong>Questions:</strong> ${sectionData.questions.length}</p>
                    <div class="mt-4">
                        <button onclick="startSection('section1')" class="start-section-btn bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg">
                            ▶️ Start ${sectionData.title}
                        </button>
                        <button onclick="audioSystem.speak('${sectionData.title}')" class="ml-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition">
                            🔊 Play Audio
                        </button>
                    </div>
                </div>
            </div>
            <div id="section1-content" class="questions-container hidden">
                <!-- Questions will be rendered here -->
            </div>
        `;
        
        debugLog('Section 1 manually rendered');
        return true;
    }
    
    debugLog('Section 1 is properly loaded');
    return true;
}

// ================================
// LINE MATCHING SYSTEM
// ================================

let lineMatchingState = {
    currentInstructionIndex: 0,
    instructions: [],
    lines: [],
    selectedElement: null,
    isDrawingLine: false
};

function initializeLineMatching(question) {
    lineMatchingState.currentInstructionIndex = 0;
    lineMatchingState.instructions = question.audio_instructions;
    lineMatchingState.lines = [];
    lineMatchingState.selectedElement = null;
    lineMatchingState.isDrawingLine = false;
    
    // Add click listeners to numbers and images
    document.querySelectorAll('.number-item, .image-item').forEach(element => {
        element.addEventListener('click', handleElementClick);
    });
    
    debugLog('Line matching initialized', lineMatchingState);
}

function handleElementClick(event) {
    const element = event.currentTarget;
    const type = element.dataset.type;
    
    if (!lineMatchingState.selectedElement) {
        // First selection
        lineMatchingState.selectedElement = element;
        element.classList.add('border-yellow-500', 'bg-yellow-200');
        element.style.borderWidth = '4px';
        debugLog('First element selected', element);
    } else {
        // Second selection - try to draw line
        const firstElement = lineMatchingState.selectedElement;
        const firstType = firstElement.dataset.type;
        const secondType = element.dataset.type;
        
        // Only allow connecting number to image or image to number
        if ((firstType === 'number' && secondType === 'image') || 
            (firstType === 'image' && secondType === 'number')) {
            
            drawLineBetweenElements(firstElement, element);
            showToast('Line drawn! 📝', 'success');
        } else {
            showToast('Connect a number to an image! 🔗', 'error');
        }
        
        // Reset selection
        document.querySelectorAll('.number-item, .image-item').forEach(el => {
            el.classList.remove('border-yellow-500', 'bg-yellow-200');
            el.style.borderWidth = '3px';
        });
        lineMatchingState.selectedElement = null;
    }
}

function drawLineBetweenElements(element1, element2) {
    const svg = document.getElementById('linesSvg');
    const container = document.querySelector('.line-matching-container');
    
    // Get positions relative to container
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const x1 = rect1.left + rect1.width / 2 - containerRect.left;
    const y1 = rect1.top + rect1.height / 2 - containerRect.top;
    const x2 = rect2.left + rect2.width / 2 - containerRect.left;
    const y2 = rect2.top + rect2.height / 2 - containerRect.top;
    
    // Create line element
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#3b82f6');
    line.setAttribute('stroke-width', '3');
    line.setAttribute('stroke-linecap', 'round');
    line.classList.add('drawn-line');
    
    // Store line data
    const lineData = {
        element: line,
        from: element1.dataset.type === 'number' ? element1.dataset.number : element1.dataset.imageId,
        to: element2.dataset.type === 'image' ? element2.dataset.imageId : element2.dataset.number,
        fromType: element1.dataset.type,
        toType: element2.dataset.type
    };
    
    lineMatchingState.lines.push(lineData);
    svg.appendChild(line);
    
    debugLog('Line drawn', lineData);
}

function playAllInstructions(sectionId, questionIndex) {
    const question = AppState.questionsData[sectionId].questions[questionIndex];
    lineMatchingState.instructions = question.audio_instructions;
    lineMatchingState.currentInstructionIndex = 0;
    
    let instructionText = '';
    question.audio_instructions.forEach((instruction, index) => {
        instructionText += instruction + '. ';
    });
    
    document.getElementById('current-instruction').textContent = 'Playing all instructions...';
    audioSystem.speak(instructionText);
    
    // Update progress bar
    document.getElementById('instruction-progress-bar').style.width = '100%';
    
    setTimeout(() => {
        document.getElementById('current-instruction').textContent = 'All instructions played. Start drawing lines!';
    }, 3000);
}

function playNextInstruction(sectionId, questionIndex) {
    const question = AppState.questionsData[sectionId].questions[questionIndex];
    
    if (lineMatchingState.currentInstructionIndex < question.audio_instructions.length) {
        const instruction = question.audio_instructions[lineMatchingState.currentInstructionIndex];
        
        document.getElementById('current-instruction').textContent = instruction;
        audioSystem.speak(instruction);
        
        lineMatchingState.currentInstructionIndex++;
        
        // Update progress bar
        const progress = (lineMatchingState.currentInstructionIndex / question.audio_instructions.length) * 100;
        document.getElementById('instruction-progress-bar').style.width = progress + '%';
        
        if (lineMatchingState.currentInstructionIndex >= question.audio_instructions.length) {
            setTimeout(() => {
                document.getElementById('current-instruction').textContent = 'All instructions complete! Draw your lines.';
            }, 3000);
        }
    } else {
        document.getElementById('current-instruction').textContent = 'All instructions complete!';
        showToast('All instructions played! 🎉', 'info');
    }
}

function clearAllLines() {
    const svg = document.getElementById('linesSvg');
    const lines = svg.querySelectorAll('.drawn-line');
    lines.forEach(line => line.remove());
    
    lineMatchingState.lines = [];
    lineMatchingState.selectedElement = null;
    
    // Reset element styles
    document.querySelectorAll('.number-item, .image-item').forEach(el => {
        el.classList.remove('border-yellow-500', 'bg-yellow-200');
        el.style.borderWidth = '3px';
    });
    
    showToast('All lines cleared! 🗑️', 'info');
    debugLog('Lines cleared');
}

function checkLineMatching(sectionId, questionIndex) {
    const question = AppState.questionsData[sectionId].questions[questionIndex];
    let correctCount = 0;
    let totalExpected = question.images_1.length;
    
    debugLog('Checking line matching', {
        drawnLines: lineMatchingState.lines.length,
        expectedLines: totalExpected,
        lines: lineMatchingState.lines
    });
    
    // Check each line
    lineMatchingState.lines.forEach(line => {
        const numberValue = line.fromType === 'number' ? parseInt(line.from) : parseInt(line.to);
        const imageId = line.fromType === 'image' ? parseInt(line.from) : parseInt(line.to);
        
        // Find the correct image for this number
        const correctImage = question.images_1.find(img => img.id === numberValue);
        
        if (correctImage && correctImage.id === imageId) {
            correctCount++;
            debugLog(`Correct match: ${numberValue} → ${imageId}`);
        } else {
            debugLog(`Incorrect match: ${numberValue} → ${imageId} (should be ${correctImage?.id})`);
        }
    });
    
    const percentage = Math.round((correctCount / totalExpected) * 100);
    AppState.score += correctCount;
    
    // Visual feedback
    if (percentage >= 80) {
        audioSystem.speak(`Excellent! You got ${correctCount} out of ${totalExpected} correct!`);
        showToast(`Great job! ${correctCount}/${totalExpected} correct! 🎉`, 'success');
    } else if (percentage >= 60) {
        audioSystem.speak(`Good work! You got ${correctCount} out of ${totalExpected} correct!`);
        showToast(`Good work! ${correctCount}/${totalExpected} correct! 👍`, 'success');
    } else {
        audioSystem.speak(`Keep trying! You got ${correctCount} out of ${totalExpected} correct!`);
        showToast(`Keep practicing! ${correctCount}/${totalExpected} correct! 📚`, 'error');
    }
    
    setTimeout(() => {
        nextQuestion(sectionId);
    }, 3000);
}

// ================================
// COLUMN LINE MATCHING SYSTEM  
// ================================

let columnLineMatchingState = {
    currentInstructionIndex: 0,
    currentSection: 'a', // 'a' or 'b'
    sectionAInstructions: [],
    sectionBInstructions: [],
    lines: [],
    selectedElement: null,
    sectionAProgress: 0,
    sectionBProgress: 0
};

function initializeLineMatchingColumns(question) {
    columnLineMatchingState.currentInstructionIndex = 0;
    columnLineMatchingState.currentSection = 'a';
    columnLineMatchingState.sectionAInstructions = question.section_a.audio_instructions;
    columnLineMatchingState.sectionBInstructions = question.section_b.audio_instructions;
    columnLineMatchingState.lines = [];
    columnLineMatchingState.selectedElement = null;
    columnLineMatchingState.sectionAProgress = 0;
    columnLineMatchingState.sectionBProgress = 0;
    
    // Add click listeners to numbers and images
    document.querySelectorAll('.number-item, .image-item').forEach(element => {
        element.addEventListener('click', handleColumnElementClick);
    });
    
    debugLog('Column line matching initialized', columnLineMatchingState);
}

function handleColumnElementClick(event) {
    const element = event.currentTarget;
    const type = element.dataset.type;
    const section = element.dataset.section;
    
    if (!columnLineMatchingState.selectedElement) {
        // First selection
        columnLineMatchingState.selectedElement = element;
        element.classList.add('border-yellow-500', 'bg-yellow-200');
        element.style.borderWidth = '4px';
        debugLog('First element selected', element);
    } else {
        // Second selection - try to draw line
        const firstElement = columnLineMatchingState.selectedElement;
        const firstType = firstElement.dataset.type;
        const firstSection = firstElement.dataset.section;
        const secondType = element.dataset.type;
        const secondSection = element.dataset.section;
        
        // Only allow connecting within the same section (a-a or b-b) and number to image
        if (firstSection === secondSection && 
            ((firstType === 'number' && secondType === 'image') || 
             (firstType === 'image' && secondType === 'number'))) {
            
            drawLineBetweenColumnsElements(firstElement, element);
            showToast(`Line drawn in Section ${firstSection.toUpperCase()}! 📝`, 'success');
        } else if (firstSection !== secondSection) {
            showToast('Connect within the same section (A or B)! 🔗', 'error');
        } else {
            showToast('Connect a number to an image! 🔗', 'error');
        }
        
        // Reset selection
        document.querySelectorAll('.number-item, .image-item').forEach(el => {
            el.classList.remove('border-yellow-500', 'bg-yellow-200');
            el.style.borderWidth = '3px';
        });
        columnLineMatchingState.selectedElement = null;
    }
}

function drawLineBetweenColumnsElements(element1, element2) {
    const svg = document.getElementById('linesSvg');
    const container = document.querySelector('.columns-container');
    
    // Get positions relative to container
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const x1 = rect1.left + rect1.width / 2 - containerRect.left;
    const y1 = rect1.top + rect1.height / 2 - containerRect.top;
    const x2 = rect2.left + rect2.width / 2 - containerRect.left;
    const y2 = rect2.top + rect2.height / 2 - containerRect.top;
    
    // Create line element with different colors for sections
    const section = element1.dataset.section;
    const lineColor = section === 'a' ? '#3b82f6' : '#7c3aed'; // blue for A, purple for B
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', lineColor);
    line.setAttribute('stroke-width', '3');
    line.setAttribute('stroke-linecap', 'round');
    line.classList.add('drawn-line', `section-${section}-line`);
    
    // Store line data
    const lineData = {
        element: line,
        section: section,
        from: element1.dataset.type === 'number' ? element1.dataset.number : element1.dataset.imageId,
        to: element2.dataset.type === 'image' ? element2.dataset.imageId : element2.dataset.number,
        fromType: element1.dataset.type,
        toType: element2.dataset.type
    };
    
    columnLineMatchingState.lines.push(lineData);
    svg.appendChild(line);
    
    debugLog('Column line drawn', lineData);
}

function playAllInstructionsColumns(sectionId, questionIndex) {
    const question = AppState.questionsData[sectionId].questions[questionIndex];
    
    let allInstructions = '';
    
    // Section A instructions
    allInstructions += 'Section A: ';
    question.section_a.audio_instructions.forEach(instruction => {
        allInstructions += instruction + '. ';
    });
    
    allInstructions += ' Section B: ';
    question.section_b.audio_instructions.forEach(instruction => {
        allInstructions += instruction + '. ';
    });
    
    document.getElementById('current-instruction-a').textContent = 'Playing all Section A instructions...';
    document.getElementById('current-instruction-b').textContent = 'Playing all Section B instructions...';
    
    audioSystem.speak(allInstructions);
    
    // Update progress bars
    document.getElementById('instruction-progress-a').style.width = '100%';
    document.getElementById('instruction-progress-b').style.width = '100%';
    
    setTimeout(() => {
        document.getElementById('current-instruction-a').textContent = 'All Section A instructions played!';
        document.getElementById('current-instruction-b').textContent = 'All Section B instructions played!';
    }, 3000);
}

function playNextInstructionColumns(sectionId, questionIndex) {
    const question = AppState.questionsData[sectionId].questions[questionIndex];
    
    if (columnLineMatchingState.currentSection === 'a') {
        // Play Section A instruction
        if (columnLineMatchingState.sectionAProgress < question.section_a.audio_instructions.length) {
            const instruction = question.section_a.audio_instructions[columnLineMatchingState.sectionAProgress];
            
            document.getElementById('current-instruction-a').textContent = instruction;
            audioSystem.speak(instruction);
            
            columnLineMatchingState.sectionAProgress++;
            const progressA = (columnLineMatchingState.sectionAProgress / question.section_a.audio_instructions.length) * 100;
            document.getElementById('instruction-progress-a').style.width = progressA + '%';
            
            if (columnLineMatchingState.sectionAProgress >= question.section_a.audio_instructions.length) {
                columnLineMatchingState.currentSection = 'b';
                setTimeout(() => {
                    document.getElementById('current-instruction-a').textContent = 'Section A complete! Now starting Section B...';
                }, 3000);
            }
        } else {
            columnLineMatchingState.currentSection = 'b';
        }
    } else {
        // Play Section B instruction
        if (columnLineMatchingState.sectionBProgress < question.section_b.audio_instructions.length) {
            const instruction = question.section_b.audio_instructions[columnLineMatchingState.sectionBProgress];
            
            document.getElementById('current-instruction-b').textContent = instruction;
            audioSystem.speak(instruction);
            
            columnLineMatchingState.sectionBProgress++;
            const progressB = (columnLineMatchingState.sectionBProgress / question.section_b.audio_instructions.length) * 100;
            document.getElementById('instruction-progress-b').style.width = progressB + '%';
            
            if (columnLineMatchingState.sectionBProgress >= question.section_b.audio_instructions.length) {
                setTimeout(() => {
                    document.getElementById('current-instruction-b').textContent = 'Both sections complete! Draw your lines.';
                }, 3000);
            }
        } else {
            showToast('All instructions played! 🎉', 'info');
        }
    }
}

function clearAllLinesColumns() {
    const svg = document.getElementById('linesSvg');
    const lines = svg.querySelectorAll('.drawn-line');
    lines.forEach(line => line.remove());
    
    columnLineMatchingState.lines = [];
    columnLineMatchingState.selectedElement = null;
    
    // Reset element styles
    document.querySelectorAll('.number-item, .image-item').forEach(el => {
        el.classList.remove('border-yellow-500', 'bg-yellow-200');
        el.style.borderWidth = '3px';
    });
    
    showToast('All lines cleared! 🗑️', 'info');
    debugLog('Column lines cleared');
}

function checkLineMatchingColumns(sectionId, questionIndex) {
    const question = AppState.questionsData[sectionId].questions[questionIndex];
    let sectionACorrect = 0;
    let sectionBCorrect = 0;
    let totalSectionA = question.section_a.images.length;
    let totalSectionB = question.section_b.images.length;
    
    debugLog('Checking column line matching', {
        drawnLines: columnLineMatchingState.lines.length,
        expectedLinesA: totalSectionA,
        expectedLinesB: totalSectionB,
        lines: columnLineMatchingState.lines
    });
    
    // Check each line
    columnLineMatchingState.lines.forEach(line => {
        const numberValue = line.fromType === 'number' ? parseInt(line.from) : parseInt(line.to);
        const imageId = line.fromType === 'image' ? parseInt(line.from) : parseInt(line.to);
        const section = line.section;
        
        // Find the correct image for this number in the appropriate section
        let correctImage;
        if (section === 'a') {
            correctImage = question.section_a.images.find(img => img.id === numberValue);
            if (correctImage && correctImage.id === imageId) {
                sectionACorrect++;
                debugLog(`Section A correct match: ${numberValue} → ${imageId}`);
            } else {
                debugLog(`Section A incorrect match: ${numberValue} → ${imageId} (should be ${correctImage?.id})`);
            }
        } else {
            correctImage = question.section_b.images.find(img => img.id === numberValue);
            if (correctImage && correctImage.id === imageId) {
                sectionBCorrect++;
                debugLog(`Section B correct match: ${numberValue} → ${imageId}`);
            } else {
                debugLog(`Section B incorrect match: ${numberValue} → ${imageId} (should be ${correctImage?.id})`);
            }
        }
    });
    
    const percentageA = Math.round((sectionACorrect / totalSectionA) * 100);
    const percentageB = Math.round((sectionBCorrect / totalSectionB) * 100);
    const totalCorrect = sectionACorrect + sectionBCorrect;
    const totalExpected = totalSectionA + totalSectionB;
    const overallPercentage = Math.round((totalCorrect / totalExpected) * 100);
    
    AppState.score += totalCorrect;
    
    // Visual feedback
    let feedbackMessage = `Section A: ${sectionACorrect}/${totalSectionA} correct (${percentageA}%)\\n`;
    feedbackMessage += `Section B: ${sectionBCorrect}/${totalSectionB} correct (${percentageB}%)\\n`;
    feedbackMessage += `Overall: ${totalCorrect}/${totalExpected} correct (${overallPercentage}%)`;
    
    if (overallPercentage >= 80) {
        audioSystem.speak(`Excellent! You got ${totalCorrect} out of ${totalExpected} correct across both sections!`);
        showToast(`Outstanding! ${totalCorrect}/${totalExpected} correct! 🎉`, 'success');
    } else if (overallPercentage >= 60) {
        audioSystem.speak(`Good work! You got ${totalCorrect} out of ${totalExpected} correct!`);
        showToast(`Good work! ${totalCorrect}/${totalExpected} correct! 👍`, 'success');
    } else {
        audioSystem.speak(`Keep practicing! You got ${totalCorrect} out of ${totalExpected} correct!`);
        showToast(`Keep practicing! ${totalCorrect}/${totalExpected} correct! 📚`, 'error');
    }
    
    setTimeout(() => {
        nextQuestion(sectionId);
    }, 4000);
}

function generateNewImages(sectionId, questionIndex) {
    const sectionData = AppState.questionsData[sectionId];
    const vocabularyBank = sectionData.vocabulary_bank;
    
    if (!vocabularyBank || vocabularyBank.length < 20) {
        showToast('Not enough vocabulary words available!', 'error');
        return;
    }
    
    // Shuffle the vocabulary bank
    const shuffledBank = [...vocabularyBank].sort(() => Math.random() - 0.5);
    
    // Select first 20 words
    const selectedWords = shuffledBank.slice(0, 20);
    
    // Split into Section A (first 10) and Section B (next 10)
    const sectionAWords = selectedWords.slice(0, 10);
    const sectionBWords = selectedWords.slice(10, 20);
    
    // Update the question data
    const question = sectionData.questions[questionIndex];
    
    // Update Section A
    question.section_a.images = sectionAWords.map((word, index) => ({
        id: index + 1,
        emoji: word.emoji,
        name: word.name,
        category: word.category
    }));
    
    // Update Section B  
    question.section_b.images = sectionBWords.map((word, index) => ({
        id: index + 11,
        emoji: word.emoji,
        name: word.name,
        category: word.category
    }));
    
    // Generate new audio instructions
    question.section_a.audio_instructions = sectionAWords.map((word, index) => 
        `Number ${index + 1} is ${word.name}`
    );
    
    question.section_b.audio_instructions = sectionBWords.map((word, index) => 
        `Number ${index + 11} is ${word.name}`
    );
    
    // Create new shuffled orders
    question.section_a.shuffled_order = Array.from({length: 10}, (_, i) => i + 1)
        .sort(() => Math.random() - 0.5);
    question.section_b.shuffled_order = Array.from({length: 10}, (_, i) => i + 11)
        .sort(() => Math.random() - 0.5);
    
    debugLog('New images generated', {
        sectionA: sectionAWords.map(w => w.name),
        sectionB: sectionBWords.map(w => w.name)
    });
    
    // Clear existing lines
    clearAllLinesColumns();
    
    // Reset audio progress
    columnLineMatchingState.currentInstructionIndex = 0;
    columnLineMatchingState.currentSection = 'a';
    columnLineMatchingState.sectionAProgress = 0;
    columnLineMatchingState.sectionBProgress = 0;
    
    // Re-render the question with new images
    renderQuestion(sectionId, questionIndex);
    
    showToast('New images generated! 🎲', 'success');
    audioSystem.speak('New images are ready! Listen to the instructions again.');
}

// ================================
// MAIN INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', function() {
    try {
        debugLog('Application starting...');
        
        // Initialize core systems that don't depend on teacher selection
        initializeDragAndDrop();
        
        // Don't initialize main navigation here - it will be done when "Other Games" is selected
        // Don't show welcome section - teacher selection will handle initial display
        
        // Add a check for section1 after a brief delay to ensure it's loaded
        setTimeout(() => {
            if (AppState.questionsData && AppState.questionsData.section1) {
                debugLog('Section1 verification: PASSED', {
                    title: AppState.questionsData.section1.title,
                    questions: AppState.questionsData.section1.questions.length
                });
                
                // Verify section1 DOM element exists and has content
                const section1Element = document.getElementById('section1');
                if (section1Element && section1Element.innerHTML.trim() !== '<div class="loading">Loading Section 1 questions...</div>') {
                    debugLog('Section1 DOM verification: PASSED');
                } else {
                    console.warn('Section1 DOM not properly initialized, forcing re-render...');
                    if (questionsLoader) {
                        questionsLoader.renderSection('section1');
                    }
                }
            } else {
                console.error('Section1 verification: FAILED');
                showToast('Section 1 failed to load', 'error');
            }
        }, 2000);
        
        debugLog('Application initialized successfully');
        showToast('English Review Game loaded! 🎉', 'success');
        
    } catch (error) {
        console.error('Application initialization failed', error);
        showToast('Application failed to load', 'error');
    }
});

function initializeMainNavigation() {
    try {
        // Main category buttons
        const categoryButtons = document.querySelectorAll('.main-category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.dataset.category;
                debugLog('Category selected:', category);
                
                // Update button states
                categoryButtons.forEach(btn => {
                    btn.classList.remove('bg-blue-600', 'bg-green-600', 'bg-teal-600', 'text-white');
                    btn.classList.add('bg-gray-300', 'text-gray-700');
                });
                
                // Hide all navigation sections
                document.getElementById('practice-navigation')?.classList.add('hidden');
                document.getElementById('games-navigation')?.classList.add('hidden');
                document.getElementById('content-navigation')?.classList.add('hidden');
                
                // Hide all category descriptions
                document.querySelectorAll('.category-desc').forEach(desc => desc.classList.add('hidden'));
                
                // Show selected category
                if (category === 'practice') {
                    this.classList.remove('bg-gray-300', 'text-gray-700');
                    this.classList.add('bg-blue-600', 'text-white');
                    document.getElementById('practice-navigation')?.classList.remove('hidden');
                    document.getElementById('practice-desc')?.classList.remove('hidden');
                    showSection('welcome');
                } else if (category === 'games') {
                    this.classList.remove('bg-gray-300', 'text-gray-700');
                    this.classList.add('bg-green-600', 'text-white');
                    document.getElementById('games-navigation')?.classList.remove('hidden');
                    document.getElementById('games-desc')?.classList.remove('hidden');
                } else if (category === 'content') {
                    this.classList.remove('bg-gray-300', 'text-gray-700');
                    this.classList.add('bg-teal-600', 'text-white');
                    document.getElementById('content-navigation')?.classList.remove('hidden');
                    document.getElementById('content-desc')?.classList.remove('hidden');
                    showSection('contentBank');
                }
            });
        });
        
        // Section buttons
        const sectionButtons = document.querySelectorAll('.section-btn');
        sectionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetSection = this.dataset.section;
                debugLog('Section selected:', targetSection);
                
                // Update button states
                sectionButtons.forEach(btn => {
                    btn.classList.remove('bg-blue-500', 'text-white');
                    btn.classList.add('bg-gray-200', 'text-gray-700');
                });
                
                this.classList.remove('bg-gray-200', 'text-gray-700');
                this.classList.add('bg-blue-500', 'text-white');
                
                showSection(targetSection);
            });
        });
        
        // Start button
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                // Switch to practice questions
                const practiceBtn = document.querySelector('[data-category="practice"]');
                if (practiceBtn) {
                    practiceBtn.click();
                }
                // Then go to section 1
                setTimeout(() => {
                    const section1Btn = document.querySelector('[data-section="section1"]');
                    if (section1Btn) {
                        section1Btn.click();
                    }
                }, 100);
            });
        }
        
    } catch (error) {
        console.error('Main navigation initialization failed', error);
    }
}

function initializeGameNavigation() {
    try {
        const gameButtons = document.querySelectorAll('.game-btn');
        gameButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetSection = this.dataset.section;
                debugLog('Game selected:', targetSection);
                
                if (targetSection === 'random') {
                    showRandomGame();
                } else if (targetSection) {
                    showSection(targetSection);
                }
            });
        });
        
    } catch (error) {
        console.error('Game navigation initialization failed', error);
    }
}

function showRandomGame() {
    const games = ['familyTree', 'colorSort', 'counting', 'numberGame', 'numberMatch', 
                   'foodGame', 'transportGame', 'actionGame', 'comprehensiveGame', 'flashcards'];
    const randomGame = games[Math.floor(Math.random() * games.length)];
    debugLog('Random game selected:', randomGame);
    showSection(randomGame);
}

// ================================
// EXPOSE GLOBAL FUNCTIONS
// ================================

// Make functions available globally for HTML onclick handlers
window.showSection = showSection;
window.startSection = startSection;
window.selectAnswer = selectAnswer;
window.selectYesNo = selectYesNo;
window.skipQuestion = skipQuestion;
window.restartSection = restartSection;
window.goToNextSection = goToNextSection;
window.setDrawingTool = setDrawingTool;
window.clearCanvas = clearCanvas;
window.completeDrawing = completeDrawing;
window.checkMatching = checkMatching;
window.audioSystem = audioSystem;
window.ensureSection1Loaded = ensureSection1Loaded;
window.playAllInstructions = playAllInstructions;
window.playNextInstruction = playNextInstruction;
window.clearAllLines = clearAllLines;
window.checkLineMatching = checkLineMatching;
window.playAllInstructionsColumns = playAllInstructionsColumns;
window.playNextInstructionColumns = playNextInstructionColumns;
window.clearAllLinesColumns = clearAllLinesColumns;
window.checkLineMatchingColumns = checkLineMatchingColumns;
window.generateNewImages = generateNewImages;
window.shuffleSubjectActionImages = shuffleSubjectActionImages;
window.playListenAndCircleAudio = playListenAndCircleAudio;
window.selectListenAndCircleOption = selectListenAndCircleOption;
window.playAllListenAndCircleQuestions = playAllListenAndCircleQuestions;
window.shuffleListenAndCircleQuestions = shuffleListenAndCircleQuestions;
window.checkListenAndCircleAnswers = checkListenAndCircleAnswers;

debugLog('App.js loaded successfully - All critical systems ready!'); 

function renderSubjectActionMatchingQuestion(question, sectionId, questionIndex) {
    // Use current subjects and actions (5 each) or create shuffled arrays
    const displaySubjects = question.shuffled_subjects ? 
        question.shuffled_subjects.map(index => question.current_subjects.find(subj => subj.id === index)) :
        [...question.current_subjects];
    
    const displayActions = question.shuffled_actions ? 
        question.shuffled_actions.map(index => question.current_actions.find(action => action.id === index)) :
        [...question.current_actions];
    
    return `
        <div class="question-container bg-white rounded-xl shadow-lg p-8">
            <div class="question-header text-center mb-8">
                <div class="question-emoji text-8xl mb-4">${question.emoji || '🔗'}</div>
                <h3 class="question-text text-2xl font-bold mb-4 text-gray-800">${question.question}</h3>
                <p class="instructions text-gray-600 text-lg mb-4">${question.instructions}</p>
            </div>
            
            <div class="subject-action-container relative bg-gray-50 rounded-xl p-6" style="min-height: 500px;">
                <!-- SVG for drawing lines -->
                <svg id="linesSvg" class="absolute top-0 left-0 w-full h-full" style="pointer-events: none; z-index: 10;">
                </svg>
                
                <!-- Two Column Layout -->
                <div class="grid grid-cols-2 gap-12">
                    
                    <!-- Column 1: Subjects (People/Animals) - NO TEXT -->
                    <div class="subjects-column">
                        <h4 class="font-bold mb-6 text-xl text-blue-600 text-center">Subjects (Who/What)</h4>
                        <div class="space-y-6">
                            ${displaySubjects.map((subject) => `
                                <div class="subject-item bg-blue-100 border-3 border-blue-400 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-200 transition-all" 
                                     data-subject-id="${subject.id}" data-type="subject" id="subject-${subject.id}">
                                    <div class="text-8xl">${subject.emoji}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Column 2: Actions - NO TEXT -->
                    <div class="actions-column">
                        <h4 class="font-bold mb-6 text-xl text-green-600 text-center">Actions (What doing)</h4>
                        <div class="space-y-6">
                            ${displayActions.map((action) => `
                                <div class="action-item bg-green-100 border-3 border-green-400 rounded-lg p-6 text-center cursor-pointer hover:bg-green-200 transition-all" 
                                     data-action-id="${action.id}" data-type="action" id="action-${action.id}">
                                    <div class="text-8xl">${action.emoji}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Audio Controls -->
            <div class="audio-controls mt-8 text-center">
                <div class="mb-6 space-x-4">
                    <button onclick="playAllSubjectActionInstructions('${sectionId}', ${questionIndex})" 
                            class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-lg">
                        🔊 Play All Sentences
                    </button>
                    <button onclick="playNextSubjectActionInstruction('${sectionId}', ${questionIndex})" 
                            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg">
                        ▶️ Play Next Sentence
                    </button>
                </div>
                
                <div class="mb-4">
                    <div id="current-sentence-display" class="text-lg font-semibold text-gray-700 mb-4">
                        Click "Play Next Sentence" to start
                    </div>
                    <div class="sentence-progress bg-gray-200 rounded-full h-3 max-w-md mx-auto">
                        <div id="sentence-progress-bar" class="bg-purple-500 h-3 rounded-full transition-all" style="width: 0%"></div>
                    </div>
                    <div class="text-sm text-gray-600 mt-2">
                        <span id="sentence-counter">0</span> of ${question.audio_instructions.length} sentences
                    </div>
                </div>
            </div>
            
            <!-- Line Drawing Controls -->
            <div class="line-controls mt-8 text-center">
                <button onclick="shuffleSubjectActionImages('${sectionId}', ${questionIndex})" 
                        class="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition text-lg mr-4">
                    🎲 Shuffle Images
                </button>
                <button onclick="clearAllSubjectActionLines()" 
                        class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition text-lg mr-4">
                    🗑️ Clear All Lines
                </button>
                <button onclick="checkSubjectActionMatching('${sectionId}', ${questionIndex})" 
                        class="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition text-lg font-semibold">
                    ✅ Check Answers
                </button>
            </div>
        </div>
    `;
}

// ================================
// SUBJECT-ACTION MATCHING SYSTEM
// ================================

let subjectActionState = {
    selectedElement: null,
    connections: [],
    currentInstruction: 0,
    isDrawingMode: false
};

function initializeSubjectActionMatching(question) {
    debugLog('Initializing Subject-Action Matching:', question);
    
    // Reset state
    subjectActionState.selectedElement = null;
    subjectActionState.connections = [];
    subjectActionState.currentInstruction = 0;
    subjectActionState.isDrawingMode = false;
    
    // Add click handlers to all subject and action items
    document.querySelectorAll('.subject-item, .action-item').forEach(element => {
        element.addEventListener('click', handleSubjectActionClick);
    });
    
    debugLog('Subject-Action Matching initialized successfully');
}

function handleSubjectActionClick(event) {
    const element = event.currentTarget;
    const elementType = element.dataset.type;
    
    debugLog('Subject-Action element clicked:', {
        type: elementType,
        id: element.id,
        selectedElement: subjectActionState.selectedElement
    });
    
    if (!subjectActionState.selectedElement) {
        // First click - select element
        subjectActionState.selectedElement = element;
        element.classList.add('selected');
        element.style.transform = 'scale(1.1)';
        element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
        
        showToast(`Selected ${elementType}: ${element.querySelector('.text-lg').textContent}`, 'info');
    } else {
        // Second click - create connection
        const firstElement = subjectActionState.selectedElement;
        const firstType = firstElement.dataset.type;
        const secondType = elementType;
        
        // Reset first element styling
        firstElement.classList.remove('selected');
        firstElement.style.transform = '';
        firstElement.style.boxShadow = '';
        
        // Check if we're connecting subject to action or vice versa
        if ((firstType === 'subject' && secondType === 'action') || 
            (firstType === 'action' && secondType === 'subject')) {
            
            // Create the line connection
            drawSubjectActionLine(firstElement, element);
            
            // Store the connection
            const subjectElement = firstType === 'subject' ? firstElement : element;
            const actionElement = firstType === 'action' ? firstElement : element;
            
            const connection = {
                subjectId: subjectElement.dataset.subjectId,
                actionId: actionElement.dataset.actionId,
                subjectElement: subjectElement,
                actionElement: actionElement
            };
            
            subjectActionState.connections.push(connection);
            
            showToast(`Connected ${subjectElement.querySelector('.text-lg').textContent} → ${actionElement.querySelector('.text-lg').textContent}`, 'success');
        } else {
            showToast('You must connect a subject (person/animal) to an action!', 'error');
        }
        
        subjectActionState.selectedElement = null;
    }
}

function drawSubjectActionLine(element1, element2) {
    const svg = document.getElementById('linesSvg');
    if (!svg) return;
    
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    
    // Calculate center points relative to SVG
    const x1 = rect1.left + rect1.width/2 - svgRect.left;
    const y1 = rect1.top + rect1.height/2 - svgRect.top;
    const x2 = rect2.left + rect2.width/2 - svgRect.left;
    const y2 = rect2.top + rect2.height/2 - svgRect.top;
    
    // Create line element
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#059669'); // Green color for subject-action connections
    line.setAttribute('stroke-width', '4');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('opacity', '0.8');
    
    // Add animation
    line.style.animation = 'drawLine 0.5s ease-in-out';
    
    svg.appendChild(line);
    
    debugLog('Subject-Action line drawn between elements');
}

function playAllSubjectActionInstructions(sectionId, questionIndex) {
    const question = AppState.questionsData[sectionId].questions[questionIndex];
    
    subjectActionState.currentInstruction = 0;
    
    function playNext() {
        if (subjectActionState.currentInstruction < question.audio_instructions.length) {
            const instruction = question.audio_instructions[subjectActionState.currentInstruction];
            
            // Update display
            document.getElementById('current-sentence-display').textContent = instruction;
            document.getElementById('sentence-counter').textContent = subjectActionState.currentInstruction + 1;
            
            // Update progress bar
            const progress = ((subjectActionState.currentInstruction + 1) / question.audio_instructions.length) * 100;
            document.getElementById('sentence-progress-bar').style.width = progress + '%';
            
            // Play audio
            audioSystem.speak(instruction);
            
            subjectActionState.currentInstruction++;
            
            // Auto-play next after delay
            setTimeout(playNext, 3000);
        } else {
            document.getElementById('current-sentence-display').textContent = 'All sentences complete! Draw your lines.';
        }
    }
    
    playNext();
}

function playNextSubjectActionInstruction(sectionId, questionIndex) {
    const question = AppState.questionsData[sectionId].questions[questionIndex];
    
    if (subjectActionState.currentInstruction < question.audio_instructions.length) {
        const instruction = question.audio_instructions[subjectActionState.currentInstruction];
        
        // Update display
        document.getElementById('current-sentence-display').textContent = instruction;
        document.getElementById('sentence-counter').textContent = subjectActionState.currentInstruction + 1;
        
        // Update progress bar
        const progress = ((subjectActionState.currentInstruction + 1) / question.audio_instructions.length) * 100;
        document.getElementById('sentence-progress-bar').style.width = progress + '%';
        
        // Play audio
        audioSystem.speak(instruction);
        
        subjectActionState.currentInstruction++;
    } else {
        document.getElementById('current-sentence-display').textContent = 'All sentences complete! Draw your lines.';
        showToast('All sentences played! Now draw lines to match subjects with actions.', 'info');
    }
}

function clearAllSubjectActionLines() {
    const svg = document.getElementById('linesSvg');
    if (svg) {
        // Remove all lines
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }
    }
    
    // Reset state
    subjectActionState.connections = [];
    subjectActionState.selectedElement = null;
    
    // Remove any selected styling
    document.querySelectorAll('.subject-item, .action-item').forEach(element => {
        element.classList.remove('selected');
        element.style.transform = '';
        element.style.boxShadow = '';
    });
    
    showToast('All lines cleared!', 'info');
}

function checkSubjectActionMatching(sectionId, questionIndex) {
    const question = AppState.questionsData[sectionId].questions[questionIndex];
    const correctMatches = question.correct_matches;
    
    let correctCount = 0;
    let totalExpected = correctMatches.length;
    
    debugLog('Checking Subject-Action Matching:', {
        connections: subjectActionState.connections,
        correctMatches: correctMatches
    });
    
    // Check each connection
    subjectActionState.connections.forEach(connection => {
        const isCorrect = correctMatches.some(correct => 
            parseInt(connection.subjectId) === correct.subject_id && 
            parseInt(connection.actionId) === correct.action_id
        );
        
        if (isCorrect) {
            correctCount++;
        }
    });
    
    const percentage = Math.round((correctCount / totalExpected) * 100);
    
    // Update score
    AppState.score += correctCount;
    
    let resultMessage = '';
    if (percentage >= 90) {
        resultMessage = `🎉 Excellent! ${correctCount}/${totalExpected} correct (${percentage}%)!`;
    } else if (percentage >= 70) {
        resultMessage = `👍 Good job! ${correctCount}/${totalExpected} correct (${percentage}%)!`;
    } else if (percentage >= 50) {
        resultMessage = `😊 Not bad! ${correctCount}/${totalExpected} correct (${percentage}%)!`;
    } else {
        resultMessage = `🤔 Keep practicing! ${correctCount}/${totalExpected} correct (${percentage}%)!`;
    }
    
    showToast(resultMessage, percentage >= 70 ? 'success' : 'warning');
    
    // Show some of the correct answers
    const feedback = document.createElement('div');
    feedback.className = 'mt-4 p-4 bg-blue-50 rounded-lg';
    feedback.innerHTML = `
        <h4 class="font-bold mb-2">Some correct answers:</h4>
        ${correctMatches.slice(0, 5).map(match => `
            <div class="text-sm text-gray-700">${match.sentence}</div>
        `).join('')}
    `;
    
    document.querySelector('.question-container').appendChild(feedback);
    
    setTimeout(() => {
        nextQuestion(sectionId);
    }, 4000);
}

function shuffleSubjectActionImages(sectionId, questionIndex) {
    const sectionData = AppState.questionsData[sectionId];
    const subjectBank = sectionData.subject_bank;
    const actionBank = sectionData.action_bank;
    
    if (!subjectBank || subjectBank.length < 5 || !actionBank || actionBank.length < 5) {
        showToast('Not enough subjects or actions available!', 'error');
        return;
    }
    
    // Shuffle and select 5 subjects and 5 actions
    const shuffledSubjects = [...subjectBank].sort(() => Math.random() - 0.5).slice(0, 5);
    const shuffledActions = [...actionBank].sort(() => Math.random() - 0.5).slice(0, 5);
    
    // Update the question data
    const question = sectionData.questions[questionIndex];
    
    // Assign new IDs 1-5 for easier matching
    question.current_subjects = shuffledSubjects.map((subject, index) => ({
        id: index + 1,
        emoji: subject.emoji,
        name: subject.name,
        category: subject.category
    }));
    
    question.current_actions = shuffledActions.map((action, index) => ({
        id: index + 1,
        emoji: action.emoji,
        name: action.name,
        base_form: action.base_form
    }));
    
    // Generate new audio instructions
    question.audio_instructions = [
        `The ${question.current_subjects[0].name} is ${question.current_actions[0].name}`,
        `The ${question.current_subjects[1].name} is ${question.current_actions[1].name}`,
        `The ${question.current_subjects[2].name} is ${question.current_actions[2].name}`,
        `The ${question.current_subjects[3].name} is ${question.current_actions[3].name}`,
        `The ${question.current_subjects[4].name} is ${question.current_actions[4].name}`
    ];
    
    // Update correct matches
    question.correct_matches = [
        {"subject_id": 1, "action_id": 1, "sentence": question.audio_instructions[0]},
        {"subject_id": 2, "action_id": 2, "sentence": question.audio_instructions[1]},
        {"subject_id": 3, "action_id": 3, "sentence": question.audio_instructions[2]},
        {"subject_id": 4, "action_id": 4, "sentence": question.audio_instructions[3]},
        {"subject_id": 5, "action_id": 5, "sentence": question.audio_instructions[4]}
    ];
    
    // Create new shuffled display orders
    question.shuffled_subjects = [3, 1, 5, 2, 4]; // Random display order
    question.shuffled_actions = [2, 5, 1, 4, 3];  // Random display order
    
    debugLog('New Subject-Action images generated', {
        subjects: question.current_subjects.map(s => s.name),
        actions: question.current_actions.map(a => a.name),
        instructions: question.audio_instructions
    });
    
    // Clear existing lines
    clearAllSubjectActionLines();
    
    // Reset audio progress
    subjectActionState.currentInstruction = 0;
    
    // Re-render the question with new images
    renderQuestion(sectionId, questionIndex);
    
    showToast('New images shuffled! 🎲', 'success');
    audioSystem.speak('New images are ready! Listen to the sentences again.');
}

function renderListenAndCircleQuestion(question, sectionId, questionIndex) {
    // Use current questions (5 at a time) with shuffled display
    const currentQuestions = question.current_questions || [];
    const displayOrder = question.shuffled_order || [1, 2, 3, 4, 5];
    
    return `
        <div class="question-container bg-white rounded-xl shadow-lg p-8">
            <div class="question-header text-center mb-8">
                <div class="question-emoji text-8xl mb-4">${question.emoji || '👂'}</div>
                <h3 class="question-text text-2xl font-bold mb-4 text-gray-800">${question.question}</h3>
                <p class="instructions text-gray-600 text-lg mb-4">${question.instructions}</p>
            </div>
            
            <div class="listen-circle-container bg-gray-50 rounded-xl p-6">
                ${currentQuestions.map((q, qIndex) => `
                    <div class="question-item mb-8 p-6 bg-white rounded-lg border-2 border-gray-200" data-question-id="${q.id}">
                        <!-- Audio Control for this specific question -->
                        <div class="audio-section text-center mb-6">
                            <button onclick="playListenAndCircleAudio('${q.audio}', ${q.id})" 
                                    class="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition text-lg">
                                🔊 Listen to Question ${qIndex + 1}
                            </button>
                            <div class="audio-feedback mt-2 text-sm text-gray-600" id="audio-feedback-${q.id}">
                                Click to hear the question
                            </div>
                        </div>
                        
                        <!-- Pure Image Options - NO TEXT -->
                        <div class="options-grid grid grid-cols-3 gap-6">
                            ${q.options.map((option, optIndex) => `
                                <div class="option-item bg-blue-50 border-3 border-blue-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-100 transition-all hover:transform hover:scale-105"
                                     onclick="selectListenAndCircleOption('${sectionId}', ${questionIndex}, ${q.id}, '${option.id}', '${q.correct_answer}')"
                                     data-option-id="${option.id}" data-question-id="${q.id}">
                                    <div class="text-8xl mb-2">${option.emoji}</div>
                                    <div class="option-letter text-lg font-bold text-blue-600">${String.fromCharCode(65 + optIndex)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Section Controls -->
            <div class="section-controls mt-8 text-center">
                <div class="mb-6 space-x-4">
                    <button onclick="playAllListenAndCircleQuestions('${sectionId}', ${questionIndex})" 
                            class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-lg">
                        🔊 Play All Questions
                    </button>
                    <button onclick="shuffleListenAndCircleQuestions('${sectionId}', ${questionIndex})" 
                            class="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition text-lg">
                        🎲 Shuffle Questions
                    </button>
                </div>
                
                <div class="progress-info mb-4">
                    <div class="text-lg font-semibold text-gray-700 mb-2">
                        Section Progress: <span id="listen-progress">0</span> of ${currentQuestions.length} answered
                    </div>
                    <div class="progress-bar bg-gray-200 rounded-full h-4 max-w-md mx-auto">
                        <div id="listen-progress-bar" class="bg-green-500 h-4 rounded-full transition-all" style="width: 0%"></div>
                    </div>
                </div>
                
                <button onclick="checkListenAndCircleAnswers('${sectionId}', ${questionIndex})" 
                        class="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition text-lg font-semibold">
                    ✅ Check All Answers
                </button>
            </div>
        </div>
    `;
}

// ================================
// LISTEN AND CIRCLE SYSTEM
// ================================

let listenAndCircleState = {
    selectedAnswers: {},
    currentQuestionAudio: null,
    completedQuestions: 0
};

function initializeListenAndCircle(question) {
    debugLog('Initializing Listen and Circle:', question);
    
    // Reset state
    listenAndCircleState.selectedAnswers = {};
    listenAndCircleState.currentQuestionAudio = null;
    listenAndCircleState.completedQuestions = 0;
    
    // Update progress display
    updateListenAndCircleProgress();
    
    debugLog('Listen and Circle initialized successfully');
}

function playListenAndCircleAudio(audioText, questionId) {
    debugLog(`Playing audio for question ${questionId}: "${audioText}"`);
    
    // Update feedback
    const feedbackElement = document.getElementById(`audio-feedback-${questionId}`);
    if (feedbackElement) {
        feedbackElement.textContent = `Playing: "${audioText}"`;
        feedbackElement.classList.add('text-blue-600', 'font-semibold');
    }
    
    // Play audio
    audioSystem.speak(audioText);
    
    // Reset feedback after audio
    setTimeout(() => {
        if (feedbackElement) {
            feedbackElement.textContent = 'Click to hear again';
            feedbackElement.classList.remove('text-blue-600', 'font-semibold');
        }
    }, 3000);
}

function selectListenAndCircleOption(sectionId, questionIndex, questionId, selectedOption, correctAnswer) {
    debugLog('Option selected:', {
        questionId,
        selectedOption,
        correctAnswer,
        isCorrect: selectedOption === correctAnswer
    });
    
    // Store the answer
    listenAndCircleState.selectedAnswers[questionId] = {
        selected: selectedOption,
        correct: correctAnswer,
        isCorrect: selectedOption === correctAnswer
    };
    
    // Visual feedback for the specific question
    const questionElement = document.querySelector(`[data-question-id="${questionId}"]`);
    if (questionElement) {
        // Remove previous selections
        questionElement.querySelectorAll('.option-item').forEach(option => {
            option.classList.remove('bg-green-200', 'border-green-500', 'bg-red-200', 'border-red-500', 'bg-yellow-200', 'border-yellow-500');
        });
        
        // Mark selected option
        const selectedElement = questionElement.querySelector(`[data-option-id="${selectedOption}"]`);
        if (selectedElement) {
            selectedElement.classList.add('bg-yellow-200', 'border-yellow-500');
            selectedElement.style.borderWidth = '4px';
        }
    }
    
    // Update progress
    updateListenAndCircleProgress();
    
    // Provide audio feedback
    if (selectedOption === correctAnswer) {
        showToast(`Question ${questionId}: Correct! 🎉`, 'success');
    } else {
        showToast(`Question ${questionId}: Selected`, 'info');
    }
}

function playAllListenAndCircleQuestions(sectionId, questionIndex) {
    const question = AppState.questionsData[sectionId].questions[questionIndex];
    const currentQuestions = question.current_questions || [];
    
    let currentIndex = 0;
    
    function playNext() {
        if (currentIndex < currentQuestions.length) {
            const q = currentQuestions[currentIndex];
            const feedbackElement = document.getElementById(`audio-feedback-${q.id}`);
            
            if (feedbackElement) {
                feedbackElement.textContent = `Playing question ${currentIndex + 1}: "${q.audio}"`;
                feedbackElement.classList.add('text-purple-600', 'font-semibold');
            }
            
            audioSystem.speak(`Question ${currentIndex + 1}. ${q.audio}`);
            
            currentIndex++;
            setTimeout(playNext, 4000); // 4 second delay between questions
        } else {
            // All questions played
            showToast('All questions played! Now select your answers.', 'info');
            document.querySelectorAll('[id^="audio-feedback-"]').forEach(element => {
                element.textContent = 'All questions played - select your answers';
                element.classList.remove('text-purple-600', 'font-semibold');
            });
        }
    }
    
    playNext();
}

function shuffleListenAndCircleQuestions(sectionId, questionIndex) {
    const sectionData = AppState.questionsData[sectionId];
    const questionBank = sectionData.question_bank;
    
    if (!questionBank || questionBank.length < 5) {
        showToast('Not enough questions in the bank!', 'error');
        return;
    }
    
    // Shuffle and select 5 questions from the bank
    const shuffledQuestions = [...questionBank].sort(() => Math.random() - 0.5).slice(0, 5);
    
    // Update the question data
    const question = sectionData.questions[questionIndex];
    
    // Assign new IDs 1-5 for easier tracking
    question.current_questions = shuffledQuestions.map((q, index) => ({
        id: index + 1,
        audio: q.audio,
        type: q.type,
        correct_answer: q.correct_answer,
        options: q.options.map(opt => ({...opt})) // Deep copy options
    }));
    
    // Create new shuffled display order
    question.shuffled_order = [3, 1, 5, 2, 4];
    
    debugLog('New Listen and Circle questions generated', {
        questions: question.current_questions.map(q => q.audio),
        types: question.current_questions.map(q => q.type)
    });
    
    // Reset state
    listenAndCircleState.selectedAnswers = {};
    listenAndCircleState.completedQuestions = 0;
    
    // Re-render the question with new content
    renderQuestion(sectionId, questionIndex);
    
    showToast('New questions shuffled! 🎲', 'success');
    audioSystem.speak('New questions are ready! Listen carefully to each one.');
}

function updateListenAndCircleProgress() {
    const answeredCount = Object.keys(listenAndCircleState.selectedAnswers).length;
    const totalQuestions = document.querySelectorAll('.question-item').length;
    
    // Update progress display
    const progressElement = document.getElementById('listen-progress');
    const progressBarElement = document.getElementById('listen-progress-bar');
    
    if (progressElement) {
        progressElement.textContent = answeredCount;
    }
    
    if (progressBarElement && totalQuestions > 0) {
        const percentage = (answeredCount / totalQuestions) * 100;
        progressBarElement.style.width = percentage + '%';
    }
    
    listenAndCircleState.completedQuestions = answeredCount;
}

function checkListenAndCircleAnswers(sectionId, questionIndex) {
    const question = AppState.questionsData[sectionId].questions[questionIndex];
    const currentQuestions = question.current_questions || [];
    const answers = listenAndCircleState.selectedAnswers;
    
    let correctCount = 0;
    let totalQuestions = currentQuestions.length;
    
    debugLog('Checking Listen and Circle answers:', {
        answers: answers,
        totalQuestions: totalQuestions
    });
    
    // Check if all questions are answered
    if (Object.keys(answers).length < totalQuestions) {
        showToast('Please answer all questions before checking!', 'error');
        return;
    }
    
    // Check each answer and provide visual feedback
    currentQuestions.forEach(q => {
        const answer = answers[q.id];
        const questionElement = document.querySelector(`[data-question-id="${q.id}"]`);
        
        if (questionElement && answer) {
            // Clear previous feedback
            questionElement.querySelectorAll('.option-item').forEach(option => {
                option.classList.remove('bg-green-200', 'border-green-500', 'bg-red-200', 'border-red-500', 'bg-yellow-200', 'border-yellow-500');
            });
            
            // Show correct answer
            const correctElement = questionElement.querySelector(`[data-option-id="${q.correct_answer}"]`);
            if (correctElement) {
                correctElement.classList.add('bg-green-200', 'border-green-500');
                correctElement.style.borderWidth = '4px';
            }
            
            // Show incorrect selection if different
            if (answer.selected !== q.correct_answer) {
                const selectedElement = questionElement.querySelector(`[data-option-id="${answer.selected}"]`);
                if (selectedElement) {
                    selectedElement.classList.add('bg-red-200', 'border-red-500');
                    selectedElement.style.borderWidth = '4px';
                }
            } else {
                correctCount++;
            }
        }
    });
    
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    AppState.score += correctCount;
    
    // Results message
    let resultMessage = '';
    if (percentage >= 90) {
        resultMessage = `🎉 Excellent! ${correctCount}/${totalQuestions} correct (${percentage}%)!`;
    } else if (percentage >= 70) {
        resultMessage = `👍 Good job! ${correctCount}/${totalQuestions} correct (${percentage}%)!`;
    } else if (percentage >= 50) {
        resultMessage = `😊 Not bad! ${correctCount}/${totalQuestions} correct (${percentage}%)!`;
    } else {
        resultMessage = `🤔 Keep practicing! ${correctCount}/${totalQuestions} correct (${percentage}%)!`;
    }
    
    showToast(resultMessage, percentage >= 70 ? 'success' : 'warning');
    
    // Audio feedback
    if (percentage >= 80) {
        audioSystem.speak(`Great listening! You got ${correctCount} out of ${totalQuestions} correct!`);
    } else {
        audioSystem.speak(`You got ${correctCount} out of ${totalQuestions} correct. Keep practicing your listening skills!`);
    }
    
    setTimeout(() => {
        nextQuestion(sectionId);
    }, 4000);
}

// ================================
// FLASHCARDS SYSTEM
// ================================

class FlashcardsGame {
    constructor() {
        this.currentCards = [];
        this.currentIndex = 0;
        this.isFlipped = false;
        this.mode = 'all';
        this.style = 'emoji';
        this.autoFlipTime = 0;
        this.autoFlipInterval = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const startBtn = document.getElementById('startFlashcards');
        const flipBtn = document.getElementById('flipCardBtn');
        const prevBtn = document.getElementById('prevCardBtn');
        const nextBtn = document.getElementById('nextCardBtn');
        const shuffleBtn = document.getElementById('shuffleCardsBtn');
        const resetBtn = document.getElementById('resetFlashcards');

        if (startBtn) startBtn.addEventListener('click', () => this.startFlashcards());
        if (flipBtn) flipBtn.addEventListener('click', () => this.flipCard());
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousCard());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextCard());
        if (shuffleBtn) shuffleBtn.addEventListener('click', () => this.shuffleCards());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetFlashcards());

        // Add click listener to the card itself
        const flashcard = document.getElementById('flashcard');
        if (flashcard) {
            flashcard.addEventListener('click', () => this.flipCard());
        }
    }

    getVocabularyByCategory(category) {
        if (!AppState.questionsData || !AppState.questionsData.section1 || !AppState.questionsData.section1.vocabulary_bank) {
            return [];
        }

        const vocabulary = AppState.questionsData.section1.vocabulary_bank;
        
        if (category === 'all') {
            return vocabulary;
        }
        
        return vocabulary.filter(item => item.category === category);
    }

    startFlashcards() {
        const mode = document.getElementById('flashcardMode').value;
        const style = document.getElementById('flashcardStyle').value;
        const autoFlip = document.getElementById('flashcardAuto').value;

        this.mode = mode;
        this.style = style;
        this.autoFlipTime = autoFlip === 'manual' ? 0 : parseInt(autoFlip) * 1000;

        // Get vocabulary for selected mode
        this.currentCards = this.getVocabularyByCategory(mode);
        
        if (this.currentCards.length === 0) {
            showToast('No vocabulary available for this category', 'error');
            return;
        }

        // Reset state
        this.currentIndex = 0;
        this.isFlipped = false;

        // Show flashcard display
        document.querySelector('.flashcard-settings').style.display = 'none';
        document.getElementById('flashcardDisplay').classList.remove('hidden');

        // Update mode display
        const modeNames = {
            'all': 'All Vocabulary',
            'family': 'Family Members',
            'colors': 'Colors',
            'body': 'Body Parts',
            'animals': 'Animals',
            'food': 'Food & Drinks',
            'school': 'School Items',
            'actions': 'Action Verbs',
            'transport': 'Transportation',
            'clothing': 'Clothing'
        };
        document.getElementById('currentMode').textContent = modeNames[mode] || mode;

        // Display first card
        this.displayCard();
        this.updateProgress();

        showToast(`Started studying ${this.currentCards.length} flashcards!`, 'success');
        debugLog('Flashcards started', { 
            mode: mode, 
            style: style, 
            cards: this.currentCards.length,
            autoFlip: this.autoFlipTime
        });
    }

    displayCard() {
        if (this.currentCards.length === 0) return;

        const card = this.currentCards[this.currentIndex];
        const cardEmoji = document.getElementById('cardEmoji');
        const cardText = document.getElementById('cardText');
        const cardAnswer = document.getElementById('cardAnswer');
        const cardExample = document.getElementById('cardExample');
        const cardFront = document.getElementById('cardFront');
        const cardBack = document.getElementById('cardBack');

        // Reset card state
        this.isFlipped = false;
        cardFront.classList.remove('hidden');
        cardBack.classList.add('hidden');

        // Set content based on style
        switch (this.style) {
            case 'emoji':
                cardEmoji.textContent = card.emoji;
                cardText.textContent = '?';
                cardAnswer.textContent = card.name.toUpperCase();
                break;
            case 'word':
                cardEmoji.textContent = '?';
                cardText.textContent = card.name.toUpperCase();
                cardAnswer.textContent = card.emoji;
                break;
            case 'audio':
                cardEmoji.textContent = '🔊';
                cardText.textContent = 'Listen & Answer';
                cardAnswer.textContent = card.name.toUpperCase();
                // Play audio
                audioSystem.speak(card.name);
                break;
        }

        // Set example sentence
        cardExample.textContent = `"This is a ${card.name}"`;

        // Start auto-flip timer if enabled
        if (this.autoFlipTime > 0) {
            this.clearAutoFlip();
            this.autoFlipInterval = setTimeout(() => {
                this.flipCard();
            }, this.autoFlipTime);
        }

        debugLog('Card displayed', { 
            index: this.currentIndex, 
            card: card.name, 
            style: this.style 
        });
    }

    flipCard() {
        const cardFront = document.getElementById('cardFront');
        const cardBack = document.getElementById('cardBack');

        if (this.isFlipped) {
            // Show front
            cardFront.classList.remove('hidden');
            cardBack.classList.add('hidden');
            this.isFlipped = false;
        } else {
            // Show back
            cardFront.classList.add('hidden');
            cardBack.classList.remove('hidden');
            this.isFlipped = true;
        }

        this.clearAutoFlip();
        debugLog('Card flipped', { isFlipped: this.isFlipped });
    }

    nextCard() {
        this.clearAutoFlip();
        this.currentIndex = (this.currentIndex + 1) % this.currentCards.length;
        this.displayCard();
        this.updateProgress();
        debugLog('Next card', { index: this.currentIndex });
    }

    previousCard() {
        this.clearAutoFlip();
        this.currentIndex = this.currentIndex === 0 ? this.currentCards.length - 1 : this.currentIndex - 1;
        this.displayCard();
        this.updateProgress();
        debugLog('Previous card', { index: this.currentIndex });
    }

    shuffleCards() {
        this.clearAutoFlip();
        
        // Fisher-Yates shuffle algorithm
        for (let i = this.currentCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentCards[i], this.currentCards[j]] = [this.currentCards[j], this.currentCards[i]];
        }
        
        this.currentIndex = 0;
        this.displayCard();
        this.updateProgress();
        showToast('Cards shuffled!', 'info');
        debugLog('Cards shuffled');
    }

    updateProgress() {
        const currentNum = document.getElementById('currentCardNum');
        const totalCards = document.getElementById('totalCards');
        const progressFill = document.querySelector('#flashcardDisplay .progress-fill');

        if (currentNum) currentNum.textContent = this.currentIndex + 1;
        if (totalCards) totalCards.textContent = this.currentCards.length;
        
        if (progressFill) {
            const percentage = ((this.currentIndex + 1) / this.currentCards.length) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }

    resetFlashcards() {
        this.clearAutoFlip();
        
        // Hide flashcard display
        document.getElementById('flashcardDisplay').classList.add('hidden');
        
        // Show settings
        document.querySelector('.flashcard-settings').style.display = 'block';
        
        // Reset state
        this.currentCards = [];
        this.currentIndex = 0;
        this.isFlipped = false;
        
        debugLog('Flashcards reset');
    }

    clearAutoFlip() {
        if (this.autoFlipInterval) {
            clearTimeout(this.autoFlipInterval);
            this.autoFlipInterval = null;
        }
    }
}

// Initialize flashcards when the page loads
let flashcardsGame;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    flashcardsGame = new FlashcardsGame();
});

// Global function for onclick in HTML
function flipCard() {
    if (flashcardsGame) {
        flashcardsGame.flipCard();
    }
}

debugLog('Flashcards system loaded');

// Add exam preview to game buttons
gameButtons.forEach(button => {
    button.addEventListener('click', () => {
        const section = button.getAttribute('data-section');
        if (section === 'examPreview') {
            showSection('examPreview');
        } else if (sections[section] && typeof sections[section] === 'function') {
            showSection(section);
            sections[section]();
        } else {
            console.log(`Section ${section} not yet implemented`);
        }
    });
});

// ================================
// INITIALIZE TEACHER SELECTION SYSTEM
// ================================

let teacherSelectionSystem;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    debugLog('Initializing Teacher Selection System...');
    teacherSelectionSystem = new TeacherSelectionSystem();
    
    // Questions loader will be initialized when needed (when "Other Games" is selected)
});