import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// --- Data Structures ---
interface Lesson {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Course {
  title: string;
  modules: Module[];
}

// --- Initial Course Data ---
// In a real app, this might come from an API
const initialCourseData: Course = {
  title: '3-Month Plan to Become an LLM Pro',
  modules: [
    {
      id: 1,
      title: 'Month 1: Fundamentals & Core Concepts',
      lessons: [
        { id: 101, title: 'Week 1: Introduction to LLMs & Core Architecture', description: "Understand what LLMs are, their history, applications, and the basics of Transformer architecture like self-attention. Also covers ethical considerations like bias and hallucinations.", completed: false },
        { id: 102, title: 'Week 2: Getting Started with Prompt Engineering Basics', description: "Learn to write clear prompts, use role-playing, and understand parameters like temperature. Get familiar with popular models like GPT, Gemini, and Llama.", completed: false },
        { id: 103, title: 'Week 3: LLM APIs & Basic Interaction', description: "Practice making API calls to LLMs using Python. Understand request/response formats, error handling, and the concept of tokenization and its impact.", completed: false },
        { id: 104, title: 'Week 4: Use Cases & Limitations Deep Dive', description: "Explore common use cases like content creation and code generation. Deepen understanding of LLM limitations, including lack of real-world knowledge and data freshness.", completed: false },
      ],
    },
    {
      id: 2,
      title: 'Month 2: Advanced Prompting & Model Customization',
      lessons: [
        { id: 201, title: 'Week 5: Advanced Prompt Engineering Techniques', description: "Master advanced techniques like Chain-of-Thought (CoT) for reasoning and Retrieval-Augmented Generation (RAG) to connect LLMs with external data.", completed: false },
        { id: 202, title: 'Week 6: LLM Parameters & Model Selection', description: "Dive deeper into API parameters like top_k and penalties. Learn strategies for choosing the right model based on cost, speed, and capability (open-source vs. proprietary).", completed: false },
        { id: 203, title: 'Week 7: Introduction to Fine-tuning Concepts', description: "Learn why and when to fine-tune models for specific tasks. Understand concepts like PEFT (LoRA, QLoRA) and how to prepare high-quality data for training.", completed: false },
        { id: 204, title: 'Week 8: Evaluating LLM Outputs', description: "Discover how to evaluate LLM performance using both quantitative metrics (like BLEU, ROUGE) and qualitative human judgment. Learn about common benchmarks.", completed: false },
      ],
    },
    {
      id: 3,
      title: 'Month 3: Application Development & Specialization',
      lessons: [
        { id: 301, title: 'Week 9: Building LLM-Powered Applications (Frameworks)', description: "Use frameworks like LangChain or LlamaIndex to build complex applications. Create a simple chatbot or a document Q&A system.", completed: false },
        { id: 302, title: 'Week 10: Deployment & MLOps for LLMs', description: "Understand the challenges of deploying LLMs, including cost, latency, and security. Get a high-level overview of MLOps for monitoring and maintaining models.", completed: false },
        { id: 303, title: 'Week 11: Specialization & Advanced Topics', description: "Explore specialized areas like code generation, AI agents, and multimodal LLMs. Learn how to stay current in this fast-evolving field by following research and communities.", completed: false },
        { id: 304, title: 'Week 12: Project & Continuous Learning', description: "Apply all your knowledge to a capstone project. Design and build a complete LLM-powered solution and establish a plan for continuous learning.", completed: false },
      ],
    },
  ],
};

const LOCAL_STORAGE_KEY = 'courseProgressTrackerData';

const App = () => {
  const [course, setCourse] = useState<Course>(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.title === initialCourseData.title && parsed.modules[0]?.lessons[0]?.description) {
          return parsed;
        }
      }
      return initialCourseData;
    } catch (error) {
      console.error('Error loading data from localStorage', error);
      return initialCourseData;
    }
  });
  
  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(course));
    } catch (error) {
      console.error('Error saving data to localStorage', error);
    }
  }, [course]);

  const handleToggleLesson = (moduleId: number, lessonId: number) => {
    setCourse(prevCourse => {
      const newModules = prevCourse.modules.map(module => {
        if (module.id === moduleId) {
          const newLessons = module.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return { ...lesson, completed: !lesson.completed };
            }
            return lesson;
          });
          return { ...module, lessons: newLessons };
        }
        return module;
      });
      return { ...prevCourse, modules: newModules };
    });
  };
  
  const handleToggleDetails = (lessonId: number) => {
    setExpandedLessonId(prevId => (prevId === lessonId ? null : lessonId));
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        setCourse(initialCourseData);
    }
  }

  const { totalLessons, completedLessons } = useMemo(() => {
    let total = 0;
    let completed = 0;
    course.modules.forEach(module => {
      total += module.lessons.length;
      completed += module.lessons.filter(lesson => lesson.completed).length;
    });
    return { totalLessons: total, completedLessons: completed };
  }, [course]);

  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <main className="container">
      <header className="app-header">
        <h1>{course.title}</h1>
        <div className="progress-container">
          <div className="progress-bar-wrapper" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100} aria-label="Course Completion Progress">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <span className="progress-label">{completedLessons} / {totalLessons} Weeks Completed</span>
        </div>
      </header>

      <section className="modules-list">
        {course.modules.map(module => (
          <div key={module.id} className="module-card">
            <h2>{module.title}</h2>
            <ul className="lessons-list">
              {module.lessons.map(lesson => (
                <li key={lesson.id} className={`lesson-item ${lesson.completed ? 'completed' : ''}`}>
                  <div className="lesson-header">
                    <label htmlFor={`lesson-${lesson.id}`}>
                      <input
                        type="checkbox"
                        id={`lesson-${lesson.id}`}
                        checked={lesson.completed}
                        onChange={() => handleToggleLesson(module.id, lesson.id)}
                      />
                      <span className="custom-checkbox"></span>
                      <span className="lesson-title">{lesson.title}</span>
                    </label>
                    <button 
                      className="details-toggle" 
                      onClick={() => handleToggleDetails(lesson.id)}
                      aria-expanded={expandedLessonId === lesson.id}
                      aria-controls={`details-${lesson.id}`}
                      aria-label={expandedLessonId === lesson.id ? 'Hide details' : 'Show details'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`details-icon ${expandedLessonId === lesson.id ? 'expanded' : ''}`}>
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                  </div>
                  {expandedLessonId === lesson.id && (
                     <div id={`details-${lesson.id}`} className="lesson-details">
                        <p>{lesson.description}</p>
                     </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      
      <footer className="app-footer">
        <button onClick={resetProgress} className="reset-button">Reset Progress</button>
      </footer>
    </main>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);