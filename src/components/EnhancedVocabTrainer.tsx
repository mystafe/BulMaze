'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUiStore } from '@/lib/store';

interface WordItem {
  id: string;
  word: string;
  definition: string;
  example: string;
  translation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learned: boolean;
  masteryLevel: number; // 0-5, where 5 is mastered
  lastReviewed?: Date;
  nextReview?: Date;
}

interface TestQuestion {
  id: string;
  word: string;
  definition: string;
  options: string[];
  correctAnswer: string;
  type: 'definition' | 'word' | 'sentence';
}

type LearningPhase = 'learning' | 'testing' | 'completed';

export default function EnhancedVocabTrainer() {
  const targetLang = useUiStore((s) => s.targetLang);
  const assessmentLength = useUiStore((s) => s.assessmentLength);
  const [currentPhase, setCurrentPhase] = useState<LearningPhase>('learning');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [learningProgress, setLearningProgress] = useState(0);
  const [testProgress, setTestProgress] = useState(0);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showTestResult, setShowTestResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [sessionStats, setSessionStats] = useState({
    wordsLearned: 0,
    testsPassed: 0,
    totalTests: 0,
  });

  // Sample words for different languages
  const getWordsForLanguage = (lang: string): WordItem[] => {
    const words: Record<string, WordItem[]> = {
      en: [
        {
          id: '1',
          word: 'serendipity',
          definition:
            'The occurrence and development of events by chance in a happy or beneficial way',
          example: 'Finding that book was pure serendipity.',
          difficulty: 'advanced',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '2',
          word: 'ephemeral',
          definition: 'Lasting for a very short time; transitory',
          example: 'The beauty of cherry blossoms is ephemeral.',
          difficulty: 'advanced',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '3',
          word: 'ubiquitous',
          definition: 'Present, appearing, or found everywhere',
          example: 'Smartphones have become ubiquitous in modern society.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '4',
          word: 'eloquent',
          definition: 'Fluent or persuasive in speaking or writing',
          example: 'She gave an eloquent speech about climate change.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '5',
          word: 'resilient',
          definition:
            'Able to withstand or recover quickly from difficult conditions',
          example: 'The community showed how resilient it was after the storm.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
      ],
      de: [
        {
          id: '1',
          word: 'Serendipität',
          definition:
            'Das Auftreten und die Entwicklung von Ereignissen durch Zufall auf glückliche oder vorteilhafte Weise',
          example: 'Das Finden dieses Buches war reine Serendipität.',
          difficulty: 'advanced',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '2',
          word: 'vergänglich',
          definition: 'Nur für eine sehr kurze Zeit bestehend; vorübergehend',
          example: 'Die Schönheit der Kirschblüten ist vergänglich.',
          difficulty: 'advanced',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '3',
          word: 'allgegenwärtig',
          definition: 'Überall vorhanden, erscheinend oder gefunden',
          example:
            'Smartphones sind in der modernen Gesellschaft allgegenwärtig geworden.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '4',
          word: 'beredsam',
          definition: 'Fluent oder überzeugend im Sprechen oder Schreiben',
          example: 'Sie hielt eine beredsame Rede über den Klimawandel.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '5',
          word: 'belastbar',
          definition:
            'In der Lage, schwierige Bedingungen zu ertragen oder sich schnell zu erholen',
          example:
            'Die Gemeinschaft zeigte, wie belastbar sie nach dem Sturm war.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
      ],
      es: [
        {
          id: '1',
          word: 'serendipia',
          definition:
            'La ocurrencia y desarrollo de eventos por casualidad de manera feliz o beneficiosa',
          example: 'Encontrar ese libro fue pura serendipia.',
          difficulty: 'advanced',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '2',
          word: 'efímero',
          definition: 'Durar por un tiempo muy corto; transitorio',
          example: 'La belleza de las flores de cerezo es efímera.',
          difficulty: 'advanced',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '3',
          word: 'ubicuo',
          definition: 'Presente, apareciendo o encontrado en todas partes',
          example:
            'Los smartphones se han vuelto ubicuos en la sociedad moderna.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '4',
          word: 'elocuente',
          definition: 'Fluido o persuasivo al hablar o escribir',
          example: 'Ella dio un discurso elocuente sobre el cambio climático.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '5',
          word: 'resistente',
          definition:
            'Capaz de soportar o recuperarse rápidamente de condiciones difíciles',
          example:
            'La comunidad mostró lo resistente que era después de la tormenta.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
      ],
      it: [
        {
          id: '1',
          word: 'serendipità',
          definition:
            'Il verificarsi e lo sviluppo di eventi per caso in modo felice o benefico',
          example: 'Trovare quel libro fu pura serendipità.',
          difficulty: 'advanced',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '2',
          word: 'effimero',
          definition: 'Durare per un tempo molto breve; transitorio',
          example: 'La bellezza dei fiori di ciliegio è effimera.',
          difficulty: 'advanced',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '3',
          word: 'onnipresente',
          definition: 'Presente, che appare o si trova ovunque',
          example:
            'Gli smartphone sono diventati onnipresenti nella società moderna.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '4',
          word: 'eloquente',
          definition: 'Fluente o persuasivo nel parlare o scrivere',
          example: 'Ha tenuto un discorso eloquente sui cambiamenti climatici.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '5',
          word: 'resiliente',
          definition:
            'Capace di resistere o riprendersi rapidamente da condizioni difficili',
          example:
            'La comunità ha mostrato quanto fosse resiliente dopo la tempesta.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
      ],
      pt: [
        {
          id: '1',
          word: 'serendipidade',
          definition:
            'A ocorrência e desenvolvimento de eventos por acaso de forma feliz ou benéfica',
          example: 'Encontrar esse livro foi pura serendipidade.',
          difficulty: 'advanced',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '2',
          word: 'efêmero',
          definition: 'Durar por um tempo muito curto; transitório',
          example: 'A beleza das flores de cerejeira é efêmera.',
          difficulty: 'advanced',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '3',
          word: 'onipresente',
          definition: 'Presente, aparecendo ou encontrado em todos os lugares',
          example:
            'Os smartphones se tornaram onipresentes na sociedade moderna.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '4',
          word: 'eloquente',
          definition: 'Fluente ou persuasivo ao falar ou escrever',
          example: 'Ela fez um discurso eloquente sobre mudanças climáticas.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '5',
          word: 'resiliente',
          definition:
            'Capaz de suportar ou se recuperar rapidamente de condições difíceis',
          example:
            'A comunidade mostrou o quão resiliente era após a tempestade.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
      ],
      tr: [
        {
          id: '1',
          word: 'tesadüf',
          definition:
            'Olayların şans eseri mutlu veya faydalı bir şekilde meydana gelmesi ve gelişmesi',
          example: 'O kitabı bulmak tam bir tesadüftü.',
          difficulty: 'advanced',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '2',
          word: 'geçici',
          definition: 'Çok kısa süre dayanmak; geçici',
          example: 'Kiraz çiçeklerinin güzelliği geçicidir.',
          difficulty: 'advanced',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '3',
          word: 'her yerde bulunan',
          definition: 'Her yerde mevcut, görünen veya bulunan',
          example:
            'Akıllı telefonlar modern toplumda her yerde bulunan hale geldi.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '4',
          word: 'güzel konuşan',
          definition: 'Konuşma veya yazmada akıcı veya ikna edici',
          example:
            'İklim değişikliği hakkında güzel konuşan bir konuşma yaptı.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
        {
          id: '5',
          word: 'dayanıklı',
          definition: 'Zor koşullara dayanabilme veya hızlıca toparlanabilme',
          example:
            'Topluluk fırtınadan sonra ne kadar dayanıklı olduğunu gösterdi.',
          difficulty: 'intermediate',
          learned: false,
          masteryLevel: 0,
        },
      ],
    };

    return words[lang] || words.en;
  };

  const [words, setWords] = useState<WordItem[]>(() =>
    getWordsForLanguage(targetLang),
  );

  // Update words when target language changes
  useEffect(() => {
    setWords(getWordsForLanguage(targetLang));
    setCurrentWordIndex(0);
    setCurrentPhase('learning');
    setShowDefinition(false);
    setShowExample(false);
    setLearningProgress(0);
    setTestProgress(0);
    setCurrentTestIndex(0);
    setSelectedAnswer(null);
    setShowTestResult(false);
    setTestResults({});
    setSessionStats({
      wordsLearned: 0,
      testsPassed: 0,
      totalTests: 0,
    });
  }, [targetLang]);

  const currentWord = words[currentWordIndex];

  // Generate test questions for learned words and words that need review
  const generateTestQuestions = (): TestQuestion[] => {
    const questions: TestQuestion[] = [];

    // Add questions for newly learned words (based on assessment length)
    const newlyLearned = words.slice(0, Math.min(assessmentLength, words.length));
    newlyLearned.forEach((word) => {
      // Generate wrong definitions based on the target language
      const wrongDefinitions = getWrongDefinitions(targetLang, word.difficulty);

      questions.push({
        id: `new-${word.id}`,
        word: word.word,
        definition: word.definition,
        options: [word.definition, ...wrongDefinitions.slice(0, 3)].sort(
          () => Math.random() - 0.5,
        ),
        correctAnswer: word.definition,
        type: 'definition',
      });
    });

    // Add questions for words that need review (mastery level < 3)
    const needsReview = words.filter(
      (word) => word.masteryLevel < 3 && word.masteryLevel > 0,
    );
    needsReview.forEach((word, index) => {
      if (index < 2) {
        // Limit to 2 review questions
        // Generate wrong words based on the target language
        const wrongWords = getWrongWords(targetLang, word.difficulty);

        questions.push({
          id: `review-${word.id}`,
          word: word.word,
          definition: word.definition,
          options: [word.word, ...wrongWords.slice(0, 3)].sort(
            () => Math.random() - 0.5,
          ),
          correctAnswer: word.word,
          type: 'word',
        });
      }
    });

    return questions.sort(() => Math.random() - 0.5);
  };

  // Helper function to get wrong definitions
  const getWrongDefinitions = (lang: string, difficulty: string): string[] => {
    const wrongDefs: Record<string, Record<string, string[]>> = {
      en: {
        advanced: [
          'A feeling of deep sadness and hopelessness',
          'The ability to speak clearly and effectively',
          'A sudden and unexpected change in direction',
          'The quality of being honest and straightforward',
          'A strong desire to achieve something',
        ],
        intermediate: [
          'To move quickly from one place to another',
          'The act of helping someone in need',
          'A person who is very good at something',
          'The process of making something better',
          'A feeling of great happiness and joy',
        ],
        beginner: [
          'To eat food quickly',
          'The color of the sky',
          'A person who works in an office',
          'The sound a cat makes',
          'A type of fruit that is red',
        ],
      },
      de: {
        advanced: [
          'Ein Gefühl tiefer Traurigkeit und Hoffnungslosigkeit',
          'Die Fähigkeit, klar und effektiv zu sprechen',
          'Eine plötzliche und unerwartete Richtungsänderung',
          'Die Qualität, ehrlich und direkt zu sein',
          'Ein starker Wunsch, etwas zu erreichen',
        ],
        intermediate: [
          'Sich schnell von einem Ort zum anderen bewegen',
          'Die Handlung, jemandem in Not zu helfen',
          'Eine Person, die sehr gut in etwas ist',
          'Der Prozess, etwas zu verbessern',
          'Ein Gefühl großer Freude und Glück',
        ],
        beginner: [
          'Schnell essen',
          'Die Farbe des Himmels',
          'Eine Person, die in einem Büro arbeitet',
          'Das Geräusch, das eine Katze macht',
          'Eine Art von rotem Obst',
        ],
      },
      es: {
        advanced: [
          'Un sentimiento de profunda tristeza y desesperanza',
          'La capacidad de hablar claramente y efectivamente',
          'Un cambio repentino e inesperado de dirección',
          'La cualidad de ser honesto y directo',
          'Un fuerte deseo de lograr algo',
        ],
        intermediate: [
          'Moverse rápidamente de un lugar a otro',
          'El acto de ayudar a alguien necesitado',
          'Una persona que es muy buena en algo',
          'El proceso de mejorar algo',
          'Un sentimiento de gran felicidad y alegría',
        ],
        beginner: [
          'Comer comida rápidamente',
          'El color del cielo',
          'Una persona que trabaja en una oficina',
          'El sonido que hace un gato',
          'Un tipo de fruta que es roja',
        ],
      },
      it: {
        advanced: [
          'Un sentimento di profonda tristezza e disperazione',
          'La capacità di parlare chiaramente ed efficacemente',
          'Un cambiamento improvviso e inaspettato di direzione',
          'La qualità di essere onesto e diretto',
          'Un forte desiderio di raggiungere qualcosa',
        ],
        intermediate: [
          "Muoversi rapidamente da un posto all'altro",
          "L'atto di aiutare qualcuno nel bisogno",
          'Una persona che è molto brava in qualcosa',
          'Il processo di migliorare qualcosa',
          'Un sentimento di grande felicità e gioia',
        ],
        beginner: [
          'Mangiare cibo rapidamente',
          'Il colore del cielo',
          'Una persona che lavora in un ufficio',
          'Il suono che fa un gatto',
          'Un tipo di frutta che è rossa',
        ],
      },
      pt: {
        advanced: [
          'Um sentimento de profunda tristeza e desesperança',
          'A capacidade de falar claramente e efetivamente',
          'Uma mudança repentina e inesperada de direção',
          'A qualidade de ser honesto e direto',
          'Um forte desejo de alcançar algo',
        ],
        intermediate: [
          'Mover-se rapidamente de um lugar para outro',
          'O ato de ajudar alguém necessitado',
          'Uma pessoa que é muito boa em algo',
          'O processo de melhorar algo',
          'Um sentimento de grande felicidade e alegria',
        ],
        beginner: [
          'Comer comida rapidamente',
          'A cor do céu',
          'Uma pessoa que trabalha em um escritório',
          'O som que um gato faz',
          'Um tipo de fruta que é vermelha',
        ],
      },
      tr: {
        advanced: [
          'Derin üzüntü ve umutsuzluk duygusu',
          'Açık ve etkili konuşma yeteneği',
          'Ani ve beklenmedik yön değişikliği',
          'Dürüst ve açık sözlü olma niteliği',
          'Bir şeyi başarma konusunda güçlü istek',
        ],
        intermediate: [
          'Bir yerden diğerine hızlıca hareket etmek',
          'İhtiyacı olan birine yardım etme eylemi',
          'Bir şeyde çok iyi olan kişi',
          'Bir şeyi iyileştirme süreci',
          'Büyük mutluluk ve sevinç duygusu',
        ],
        beginner: [
          'Yemeği hızlıca yemek',
          'Gökyüzünün rengi',
          'Ofiste çalışan kişi',
          'Kedinin çıkardığı ses',
          'Kırmızı olan bir meyve türü',
        ],
      },
    };

    return wrongDefs[lang]?.[difficulty] || wrongDefs.en.beginner;
  };

  // Helper function to get wrong words
  const getWrongWords = (lang: string, difficulty: string): string[] => {
    const wrongWords: Record<string, Record<string, string[]>> = {
      en: {
        advanced: ['melancholy', 'articulate', 'abrupt', 'candid', 'ambitious'],
        intermediate: ['swift', 'assist', 'expert', 'improve', 'delighted'],
        beginner: ['devour', 'azure', 'clerk', 'meow', 'apple'],
      },
      de: {
        advanced: [
          'Melancholie',
          'artikuliert',
          'abrupt',
          'offen',
          'ehrgeizig',
        ],
        intermediate: ['schnell', 'helfen', 'Experte', 'verbessern', 'erfreut'],
        beginner: ['verschlingen', 'azurblau', 'Angestellter', 'miau', 'Apfel'],
      },
      es: {
        advanced: [
          'melancolía',
          'articulado',
          'abrupto',
          'cándido',
          'ambicioso',
        ],
        intermediate: ['rápido', 'ayudar', 'experto', 'mejorar', 'encantado'],
        beginner: ['devorar', 'azul', 'empleado', 'miau', 'manzana'],
      },
      it: {
        advanced: [
          'malinconia',
          'articolato',
          'brusco',
          'candido',
          'ambizioso',
        ],
        intermediate: [
          'rapido',
          'aiutare',
          'esperto',
          'migliorare',
          'deliziato',
        ],
        beginner: ['divorare', 'azzurro', 'impiegato', 'miao', 'mela'],
      },
      pt: {
        advanced: [
          'melancolia',
          'articulado',
          'abrupto',
          'cândido',
          'ambicioso',
        ],
        intermediate: [
          'rápido',
          'ajudar',
          'especialista',
          'melhorar',
          'encantado',
        ],
        beginner: ['devorar', 'azul', 'funcionário', 'miau', 'maçã'],
      },
      tr: {
        advanced: ['melankoli', 'açık', 'ani', 'dürüst', 'hırslı'],
        intermediate: ['hızlı', 'yardım', 'uzman', 'geliştir', 'mutlu'],
        beginner: ['yutmak', 'mavi', 'memur', 'miyav', 'elma'],
      },
    };

    return wrongWords[lang]?.[difficulty] || wrongWords.en.beginner;
  };

  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([]);

  const handleNextWord = () => {
    if (currentWordIndex < assessmentLength - 1) {
      // Learn words based on assessment length
      setCurrentWordIndex((prev) => prev + 1);
      setShowDefinition(false);
      setShowExample(false);
              setLearningProgress(((currentWordIndex + 2) / assessmentLength) * 100);
    } else {
      // Move to testing phase
      const questions = generateTestQuestions();
      setTestQuestions(questions);
      setCurrentPhase('testing');
      setTestProgress(0);
      setCurrentTestIndex(0);
    }
  };

  const handleTestAnswer = (answer: string) => {
    const currentQuestion = testQuestions[currentTestIndex];
    const correct = answer === currentQuestion.correctAnswer;

    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowTestResult(true);

    setTestResults((prev) => ({
      ...prev,
      [currentQuestion.id]: correct,
    }));
  };

  const handleNextTest = () => {
    if (currentTestIndex < testQuestions.length - 1) {
      setCurrentTestIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowTestResult(false);
      setTestProgress(((currentTestIndex + 2) / testQuestions.length) * 100);
    } else {
      // Testing completed
      const passed = Object.values(testResults).filter(Boolean).length;
      setSessionStats((prev) => ({
        ...prev,
        wordsLearned: assessmentLength,
        testsPassed: passed,
        totalTests: testQuestions.length,
      }));
      setCurrentPhase('completed');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderLearningPhase = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Learning New Words</CardTitle>
          <Badge className={getDifficultyColor(currentWord.difficulty)}>
            {currentWord.difficulty}
          </Badge>
        </div>
        <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Word {currentWordIndex + 1} of {assessmentLength}</span>
          <span>{Math.round(learningProgress)}%</span>
        </div>
          <Progress value={learningProgress} className="w-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">{currentWord.word}</h2>

          {!showDefinition ? (
            <Button
              onClick={() => setShowDefinition(true)}
              className="w-full mb-4"
            >
              Show Definition
            </Button>
          ) : (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Definition:</h3>
              <p className="text-gray-700">{currentWord.definition}</p>
            </div>
          )}

          {showDefinition && !showExample ? (
            <Button
              onClick={() => setShowExample(true)}
              className="w-full mb-4"
            >
              Show Example Sentence
            </Button>
          ) : showExample ? (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Example:</h3>
              <p className="text-gray-700 italic">"{currentWord.example}"</p>
            </div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter>
        {showExample && (
          <Button onClick={handleNextWord} className="w-full">
            {currentWordIndex < assessmentLength - 1 ? 'Next Word' : 'Start Test'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  const renderTestingPhase = () => {
    const currentQuestion = testQuestions[currentTestIndex];

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Testing Your Knowledge</CardTitle>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Question {currentTestIndex + 1} of {testQuestions.length}
              </span>
              <span>{Math.round(testProgress)}%</span>
            </div>
            <Progress value={testProgress} className="w-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {currentQuestion.type === 'definition'
                ? `What is the definition of "${currentQuestion.word}"?`
                : `What word means: "${currentQuestion.definition}"?`}
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? 'default' : 'outline'}
                  className={`justify-start h-auto p-4 ${
                    showTestResult && option === currentQuestion.correctAnswer
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : selectedAnswer === option && !isCorrect
                        ? 'bg-red-100 border-red-500 text-red-800'
                        : ''
                  }`}
                  onClick={() => handleTestAnswer(option)}
                  disabled={selectedAnswer !== null}
                >
                  <span className="font-medium mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              ))}
            </div>

            {showTestResult && (
              <div
                className={`p-4 rounded-lg mt-4 ${
                  isCorrect
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <div className="font-semibold mb-2">
                  {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
                </div>
                <p>
                  <strong>Correct answer:</strong>{' '}
                  {currentQuestion.correctAnswer}
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {showTestResult && (
            <Button onClick={handleNextTest} className="w-full">
              {currentTestIndex < testQuestions.length - 1
                ? 'Next Question'
                : 'Complete Test'}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  const renderCompletedPhase = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Session Completed!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold mb-4">Great job!</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {sessionStats.wordsLearned}
              </div>
              <div className="text-sm text-gray-600">Words Learned</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {sessionStats.testsPassed}
              </div>
              <div className="text-sm text-gray-600">Tests Passed</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {sessionStats.totalTests}
              </div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Success Rate:{' '}
            {Math.round(
              (sessionStats.testsPassed / sessionStats.totalTests) * 100,
            )}
            %
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => {
            setCurrentPhase('learning');
            setCurrentWordIndex(0);
            setShowDefinition(false);
            setShowExample(false);
            setLearningProgress(0);
            setTestProgress(0);
            setCurrentTestIndex(0);
            setSelectedAnswer(null);
            setShowTestResult(false);
            setTestResults({});
            setSessionStats({
              wordsLearned: 0,
              testsPassed: 0,
              totalTests: 0,
            });
          }}
          className="w-full"
        >
          Start New Session
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {targetLang.toUpperCase()} Vocabulary Trainer
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Learn {targetLang} vocabulary step by step. Study new words with
          examples, then test your knowledge.
        </p>
      </div>

      {currentPhase === 'learning' && renderLearningPhase()}
      {currentPhase === 'testing' && renderTestingPhase()}
      {currentPhase === 'completed' && renderCompletedPhase()}
    </div>
  );
}
