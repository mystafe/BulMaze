'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUiStore } from '@/lib/store';

interface AssessmentQuestion {
  id: string;
  word: string;
  definition: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface LevelAssessmentProps {
  onComplete: (result: {
    level: 'beginner' | 'intermediate' | 'advanced';
    score: number;
    totalQuestions: number;
    beginnerCorrect: number;
    intermediateCorrect: number;
    advancedCorrect: number;
  }) => void;
  targetLang: string;
}

// Define assessment questions for different languages
const getAssessmentQuestions = (targetLang: string): AssessmentQuestion[] => {
  const questions: Record<string, AssessmentQuestion[]> = {
    en: [
      // Beginner questions
      {
        id: '1',
        word: 'happy',
        definition: 'Feeling or showing pleasure or contentment',
        options: ['happy', 'sad', 'angry', 'tired'],
        correctAnswer: 'happy',
        difficulty: 'beginner',
      },
      {
        id: '2',
        word: 'big',
        definition: 'Of considerable size or extent',
        options: ['big', 'small', 'tiny', 'huge'],
        correctAnswer: 'big',
        difficulty: 'beginner',
      },
      {
        id: '3',
        word: 'fast',
        definition: 'Moving or capable of moving at high speed',
        options: ['fast', 'slow', 'quick', 'rapid'],
        correctAnswer: 'fast',
        difficulty: 'beginner',
      },
      // Intermediate questions
      {
        id: '4',
        word: 'eloquent',
        definition: 'Fluent or persuasive in speaking or writing',
        options: ['eloquent', 'silent', 'quiet', 'mute'],
        correctAnswer: 'eloquent',
        difficulty: 'intermediate',
      },
      {
        id: '5',
        word: 'resilient',
        definition:
          'Able to withstand or recover quickly from difficult conditions',
        options: ['resilient', 'fragile', 'weak', 'delicate'],
        correctAnswer: 'resilient',
        difficulty: 'intermediate',
      },
      {
        id: '6',
        word: 'ubiquitous',
        definition: 'Present, appearing, or found everywhere',
        options: ['ubiquitous', 'rare', 'scarce', 'limited'],
        correctAnswer: 'ubiquitous',
        difficulty: 'intermediate',
      },
      // Advanced questions
      {
        id: '7',
        word: 'serendipity',
        definition:
          'The occurrence and development of events by chance in a happy or beneficial way',
        options: ['serendipity', 'coincidence', 'destiny', 'fate'],
        correctAnswer: 'serendipity',
        difficulty: 'advanced',
      },
      {
        id: '8',
        word: 'ephemeral',
        definition: 'Lasting for a very short time; transitory',
        options: ['ephemeral', 'permanent', 'eternal', 'lasting'],
        correctAnswer: 'ephemeral',
        difficulty: 'advanced',
      },
      {
        id: '9',
        word: 'pragmatic',
        definition:
          'Dealing with things sensibly and realistically in a way that is based on practical rather than idealistic considerations',
        options: ['pragmatic', 'idealistic', 'romantic', 'dreamy'],
        correctAnswer: 'pragmatic',
        difficulty: 'advanced',
      },
      {
        id: '10',
        word: 'meticulous',
        definition:
          'Showing great attention to detail; very careful and precise',
        options: ['meticulous', 'careless', 'sloppy', 'hasty'],
        correctAnswer: 'meticulous',
        difficulty: 'advanced',
      },
    ],
    de: [
      // Beginner questions
      {
        id: '1',
        word: 'glücklich',
        definition: 'Gefühl oder Zeichen von Freude oder Zufriedenheit',
        options: ['glücklich', 'traurig', 'wütend', 'müde'],
        correctAnswer: 'glücklich',
        difficulty: 'beginner',
      },
      {
        id: '2',
        word: 'groß',
        definition: 'Von beträchtlicher Größe oder Ausmaß',
        options: ['groß', 'klein', 'winzig', 'riesig'],
        correctAnswer: 'groß',
        difficulty: 'beginner',
      },
      {
        id: '3',
        word: 'schnell',
        definition:
          'Sich mit hoher Geschwindigkeit bewegen oder bewegen können',
        options: ['schnell', 'langsam', 'rasch', 'flink'],
        correctAnswer: 'schnell',
        difficulty: 'beginner',
      },
      // Intermediate questions
      {
        id: '4',
        word: 'beredsam',
        definition: 'Fluent oder überzeugend im Sprechen oder Schreiben',
        options: ['beredsam', 'still', 'leise', 'stumm'],
        correctAnswer: 'beredsam',
        difficulty: 'intermediate',
      },
      {
        id: '5',
        word: 'belastbar',
        definition:
          'In der Lage, schwierige Bedingungen zu ertragen oder sich schnell zu erholen',
        options: ['belastbar', 'zerbrechlich', 'schwach', 'empfindlich'],
        correctAnswer: 'belastbar',
        difficulty: 'intermediate',
      },
      {
        id: '6',
        word: 'allgegenwärtig',
        definition: 'Überall vorhanden, erscheinend oder gefunden',
        options: ['allgegenwärtig', 'selten', 'knapp', 'begrenzt'],
        correctAnswer: 'allgegenwärtig',
        difficulty: 'intermediate',
      },
      // Advanced questions
      {
        id: '7',
        word: 'Serendipität',
        definition:
          'Das Auftreten und die Entwicklung von Ereignissen durch Zufall auf glückliche oder vorteilhafte Weise',
        options: ['Serendipität', 'Zufall', 'Schicksal', 'Verhängnis'],
        correctAnswer: 'Serendipität',
        difficulty: 'advanced',
      },
      {
        id: '8',
        word: 'vergänglich',
        definition: 'Nur für eine sehr kurze Zeit bestehend; vorübergehend',
        options: ['vergänglich', 'permanent', 'ewig', 'dauerhaft'],
        correctAnswer: 'vergänglich',
        difficulty: 'advanced',
      },
      {
        id: '9',
        word: 'pragmatisch',
        definition:
          'Sachlich und realistisch mit Dingen umgehen, basierend auf praktischen statt idealistischen Überlegungen',
        options: ['pragmatisch', 'idealistisch', 'romantisch', 'träumerisch'],
        correctAnswer: 'pragmatisch',
        difficulty: 'advanced',
      },
      {
        id: '10',
        word: 'sorgfältig',
        definition:
          'Große Aufmerksamkeit für Details zeigen; sehr vorsichtig und präzise',
        options: ['sorgfältig', 'nachlässig', 'schlampig', 'hastig'],
        correctAnswer: 'sorgfältig',
        difficulty: 'advanced',
      },
    ],
    es: [
      // Beginner questions
      {
        id: '1',
        word: 'feliz',
        definition: 'Sentir o mostrar placer o satisfacción',
        options: ['feliz', 'triste', 'enojado', 'cansado'],
        correctAnswer: 'feliz',
        difficulty: 'beginner',
      },
      {
        id: '2',
        word: 'grande',
        definition: 'De tamaño o extensión considerable',
        options: ['grande', 'pequeño', 'diminuto', 'enorme'],
        correctAnswer: 'grande',
        difficulty: 'beginner',
      },
      {
        id: '3',
        word: 'rápido',
        definition: 'Moverse o ser capaz de moverse a alta velocidad',
        options: ['rápido', 'lento', 'veloz', 'ágil'],
        correctAnswer: 'rápido',
        difficulty: 'beginner',
      },
      // Intermediate questions
      {
        id: '4',
        word: 'elocuente',
        definition: 'Fluido o persuasivo al hablar o escribir',
        options: ['elocuente', 'silencioso', 'callado', 'mudo'],
        correctAnswer: 'elocuente',
        difficulty: 'intermediate',
      },
      {
        id: '5',
        word: 'resistente',
        definition:
          'Capaz de soportar o recuperarse rápidamente de condiciones difíciles',
        options: ['resistente', 'frágil', 'débil', 'delicado'],
        correctAnswer: 'resistente',
        difficulty: 'intermediate',
      },
      {
        id: '6',
        word: 'ubicuo',
        definition: 'Presente, apareciendo o encontrado en todas partes',
        options: ['ubicuo', 'raro', 'escaso', 'limitado'],
        correctAnswer: 'ubicuo',
        difficulty: 'intermediate',
      },
      // Advanced questions
      {
        id: '7',
        word: 'serendipia',
        definition:
          'La ocurrencia y desarrollo de eventos por casualidad de manera feliz o beneficiosa',
        options: ['serendipia', 'coincidencia', 'destino', 'suerte'],
        correctAnswer: 'serendipia',
        difficulty: 'advanced',
      },
      {
        id: '8',
        word: 'efímero',
        definition: 'Durar por un tiempo muy corto; transitorio',
        options: ['efímero', 'permanente', 'eterno', 'duradero'],
        correctAnswer: 'efímero',
        difficulty: 'advanced',
      },
      {
        id: '9',
        word: 'pragmático',
        definition:
          'Tratar las cosas de manera sensata y realista basándose en consideraciones prácticas en lugar de idealistas',
        options: ['pragmático', 'idealista', 'romántico', 'soñador'],
        correctAnswer: 'pragmático',
        difficulty: 'advanced',
      },
      {
        id: '10',
        word: 'meticuloso',
        definition: 'Mostrar gran atención al detalle; muy cuidadoso y preciso',
        options: ['meticuloso', 'descuidado', 'descuidado', 'apresurado'],
        correctAnswer: 'meticuloso',
        difficulty: 'advanced',
      },
    ],
    it: [
      // Beginner questions
      {
        id: '1',
        word: 'felice',
        definition: 'Sentire o mostrare piacere o soddisfazione',
        options: ['felice', 'triste', 'arrabbiato', 'stanco'],
        correctAnswer: 'felice',
        difficulty: 'beginner',
      },
      {
        id: '2',
        word: 'grande',
        definition: 'Di dimensioni o estensione considerevole',
        options: ['grande', 'piccolo', 'minuscolo', 'enorme'],
        correctAnswer: 'grande',
        difficulty: 'beginner',
      },
      {
        id: '3',
        word: 'veloce',
        definition: 'Muoversi o essere in grado di muoversi ad alta velocità',
        options: ['veloce', 'lento', 'rapido', 'agile'],
        correctAnswer: 'veloce',
        difficulty: 'beginner',
      },
      // Intermediate questions
      {
        id: '4',
        word: 'eloquente',
        definition: 'Fluente o persuasivo nel parlare o scrivere',
        options: ['eloquente', 'silenzioso', 'quieto', 'muto'],
        correctAnswer: 'eloquente',
        difficulty: 'intermediate',
      },
      {
        id: '5',
        word: 'resiliente',
        definition:
          'Capace di resistere o riprendersi rapidamente da condizioni difficili',
        options: ['resiliente', 'fragile', 'debole', 'delicato'],
        correctAnswer: 'resiliente',
        difficulty: 'intermediate',
      },
      {
        id: '6',
        word: 'onnipresente',
        definition: 'Presente, che appare o si trova ovunque',
        options: ['onnipresente', 'raro', 'scarso', 'limitato'],
        correctAnswer: 'onnipresente',
        difficulty: 'intermediate',
      },
      // Advanced questions
      {
        id: '7',
        word: 'serendipità',
        definition:
          'Il verificarsi e lo sviluppo di eventi per caso in modo felice o benefico',
        options: ['serendipità', 'coincidenza', 'destino', 'fortuna'],
        correctAnswer: 'serendipità',
        difficulty: 'advanced',
      },
      {
        id: '8',
        word: 'effimero',
        definition: 'Durare per un tempo molto breve; transitorio',
        options: ['effimero', 'permanente', 'eterno', 'duraturo'],
        correctAnswer: 'effimero',
        difficulty: 'advanced',
      },
      {
        id: '9',
        word: 'pragmatico',
        definition:
          'Trattare le cose in modo sensato e realista basandosi su considerazioni pratiche piuttosto che idealistiche',
        options: ['pragmatico', 'idealista', 'romantico', 'sognatore'],
        correctAnswer: 'pragmatico',
        difficulty: 'advanced',
      },
      {
        id: '10',
        word: 'meticoloso',
        definition:
          'Mostrare grande attenzione ai dettagli; molto attento e preciso',
        options: ['meticoloso', 'trascurato', 'sciatto', 'frettoloso'],
        correctAnswer: 'meticoloso',
        difficulty: 'advanced',
      },
    ],
    pt: [
      // Beginner questions
      {
        id: '1',
        word: 'feliz',
        definition: 'Sentir ou mostrar prazer ou satisfação',
        options: ['feliz', 'triste', 'irritado', 'cansado'],
        correctAnswer: 'feliz',
        difficulty: 'beginner',
      },
      {
        id: '2',
        word: 'grande',
        definition: 'De tamanho ou extensão considerável',
        options: ['grande', 'pequeno', 'minúsculo', 'enorme'],
        correctAnswer: 'grande',
        difficulty: 'beginner',
      },
      {
        id: '3',
        word: 'rápido',
        definition: 'Mover-se ou ser capaz de se mover em alta velocidade',
        options: ['rápido', 'lento', 'veloz', 'ágil'],
        correctAnswer: 'rápido',
        difficulty: 'beginner',
      },
      // Intermediate questions
      {
        id: '4',
        word: 'eloquente',
        definition: 'Fluente ou persuasivo ao falar ou escrever',
        options: ['eloquente', 'silencioso', 'quieto', 'mudo'],
        correctAnswer: 'eloquente',
        difficulty: 'intermediate',
      },
      {
        id: '5',
        word: 'resiliente',
        definition:
          'Capaz de suportar ou se recuperar rapidamente de condições difíceis',
        options: ['resiliente', 'frágil', 'fraco', 'delicado'],
        correctAnswer: 'resiliente',
        difficulty: 'intermediate',
      },
      {
        id: '6',
        word: 'onipresente',
        definition: 'Presente, aparecendo ou encontrado em todos os lugares',
        options: ['onipresente', 'raro', 'escasso', 'limitado'],
        correctAnswer: 'onipresente',
        difficulty: 'intermediate',
      },
      // Advanced questions
      {
        id: '7',
        word: 'serendipidade',
        definition:
          'A ocorrência e desenvolvimento de eventos por acaso de forma feliz ou benéfica',
        options: ['serendipidade', 'coincidência', 'destino', 'sorte'],
        correctAnswer: 'serendipidade',
        difficulty: 'advanced',
      },
      {
        id: '8',
        word: 'efêmero',
        definition: 'Durar por um tempo muito curto; transitório',
        options: ['efêmero', 'permanente', 'eterno', 'duradouro'],
        correctAnswer: 'efêmero',
        difficulty: 'advanced',
      },
      {
        id: '9',
        word: 'pragmático',
        definition:
          'Tratar as coisas de forma sensata e realista baseando-se em considerações práticas em vez de idealistas',
        options: ['pragmático', 'idealista', 'romântico', 'sonhador'],
        correctAnswer: 'pragmático',
        difficulty: 'advanced',
      },
      {
        id: '10',
        word: 'meticuloso',
        definition:
          'Mostrar grande atenção aos detalhes; muito cuidadoso e preciso',
        options: ['meticuloso', 'descuidado', 'desleixado', 'apressado'],
        correctAnswer: 'meticuloso',
        difficulty: 'advanced',
      },
    ],
    tr: [
      // Beginner questions
      {
        id: '1',
        word: 'mutlu',
        definition: 'Zevk veya memnuniyet hissetmek veya göstermek',
        options: ['mutlu', 'üzgün', 'kızgın', 'yorgun'],
        correctAnswer: 'mutlu',
        difficulty: 'beginner',
      },
      {
        id: '2',
        word: 'büyük',
        definition: 'Önemli boyut veya kapsamda',
        options: ['büyük', 'küçük', 'minik', 'devasa'],
        correctAnswer: 'büyük',
        difficulty: 'beginner',
      },
      {
        id: '3',
        word: 'hızlı',
        definition: 'Yüksek hızda hareket etmek veya hareket edebilmek',
        options: ['hızlı', 'yavaş', 'çabuk', 'çevik'],
        correctAnswer: 'hızlı',
        difficulty: 'beginner',
      },
      // Intermediate questions
      {
        id: '4',
        word: 'güzel konuşan',
        definition: 'Konuşma veya yazmada akıcı veya ikna edici',
        options: ['güzel konuşan', 'sessiz', 'sakin', 'dilsiz'],
        correctAnswer: 'güzel konuşan',
        difficulty: 'intermediate',
      },
      {
        id: '5',
        word: 'dayanıklı',
        definition: 'Zor koşullara dayanabilme veya hızlıca toparlanabilme',
        options: ['dayanıklı', 'kırılgan', 'zayıf', 'narin'],
        correctAnswer: 'dayanıklı',
        difficulty: 'intermediate',
      },
      {
        id: '6',
        word: 'her yerde bulunan',
        definition: 'Her yerde mevcut, görünen veya bulunan',
        options: ['her yerde bulunan', 'nadir', 'az', 'sınırlı'],
        correctAnswer: 'her yerde bulunan',
        difficulty: 'intermediate',
      },
      // Advanced questions
      {
        id: '7',
        word: 'tesadüf',
        definition:
          'Olayların şans eseri mutlu veya faydalı bir şekilde meydana gelmesi ve gelişmesi',
        options: ['tesadüf', 'rastlantı', 'kader', 'talih'],
        correctAnswer: 'tesadüf',
        difficulty: 'advanced',
      },
      {
        id: '8',
        word: 'geçici',
        definition: 'Çok kısa süre dayanmak; geçici',
        options: ['geçici', 'kalıcı', 'sonsuz', 'sürekli'],
        correctAnswer: 'geçici',
        difficulty: 'advanced',
      },
      {
        id: '9',
        word: 'pratik',
        definition:
          'İşleri idealist değil pratik düşüncelere dayalı olarak mantıklı ve gerçekçi bir şekilde ele almak',
        options: ['pratik', 'idealist', 'romantik', 'hayalperest'],
        correctAnswer: 'pratik',
        difficulty: 'advanced',
      },
      {
        id: '10',
        word: 'titiz',
        definition: 'Detaylara büyük dikkat göstermek; çok dikkatli ve hassas',
        options: ['titiz', 'dikkatsiz', 'dağınık', 'aceleci'],
        correctAnswer: 'titiz',
        difficulty: 'advanced',
      },
    ],
  };

  return questions[targetLang] || questions.en;
};

export default function LevelAssessment({
  onComplete,
  targetLang,
}: LevelAssessmentProps) {
  const assessmentLength = useUiStore((s) => s.assessmentLength);
  const [assessmentQuestions, setAssessmentQuestions] = useState<
    AssessmentQuestion[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scores, setScores] = useState({
    beginner: 0,
    intermediate: 0,
    advanced: 0,
  });

  useEffect(() => {
    const allQuestions = getAssessmentQuestions(targetLang);

    const beginnerQuestions = allQuestions.filter(
      (q) => q.difficulty === 'beginner',
    );
    const intermediateQuestions = allQuestions.filter(
      (q) => q.difficulty === 'intermediate',
    );
    const advancedQuestions = allQuestions.filter(
      (q) => q.difficulty === 'advanced',
    );

    const selectedQuestions: AssessmentQuestion[] = [];

    // Distribute questions based on assessmentLength
    const numAdvanced = Math.ceil(assessmentLength / 3);
    const numIntermediate = Math.ceil((assessmentLength - numAdvanced) / 2);
    const numBeginner = assessmentLength - numAdvanced - numIntermediate;

    // Add questions to the list, ensuring no duplicates and shuffling
    selectedQuestions.push(
      ...beginnerQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, numBeginner),
    );
    selectedQuestions.push(
      ...intermediateQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, numIntermediate),
    );
    selectedQuestions.push(
      ...advancedQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, numAdvanced),
    );

    // Shuffle the final list of questions
    setAssessmentQuestions(selectedQuestions.sort(() => 0.5 - Math.random()));
  }, [targetLang, assessmentLength]);

  if (assessmentQuestions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    // Update scores
    setScores((prev) => ({
      ...prev,
      [currentQuestion.difficulty]:
        prev[currentQuestion.difficulty] + (correct ? 1 : 0),
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Assessment completed
      const totalScore =
        scores.beginner + scores.intermediate + scores.advanced;
      const totalQuestions = assessmentQuestions.length;

      // Determine level based on scores
      let level: 'beginner' | 'intermediate' | 'advanced';
      if (scores.advanced >= 2) {
        level = 'advanced';
      } else if (scores.intermediate >= 2) {
        level = 'intermediate';
      } else {
        level = 'beginner';
      }

      onComplete({
        level,
        score: totalScore,
        totalQuestions,
        beginnerCorrect: scores.beginner,
        intermediateCorrect: scores.intermediate,
        advancedCorrect: scores.advanced,
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-800 bg-green-100';
      case 'intermediate':
        return 'text-yellow-800 bg-yellow-100';
      case 'advanced':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {targetLang.toUpperCase()} Level Assessment Test
          </CardTitle>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Answer {assessmentQuestions.length} questions to determine your{' '}
            {targetLang} vocabulary level
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Question {currentQuestionIndex + 1} of{' '}
                {assessmentQuestions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Question */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Question {currentQuestionIndex + 1}
              </h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}
              >
                {currentQuestion.difficulty}
              </span>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">Definition:</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {currentQuestion.definition}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">
                Choose the correct word:
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      selectedAnswer === option
                        ? isCorrect
                          ? 'default'
                          : 'outline'
                        : 'outline'
                    }
                    className={`justify-start h-auto p-4 ${
                      showResult && option === currentQuestion.correctAnswer
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : selectedAnswer === option && !isCorrect
                          ? 'bg-red-100 border-red-500 text-red-800'
                          : ''
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            {showResult && (
              <div
                className={`p-4 rounded-lg ${
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

            {showResult && (
              <div className="flex gap-2">
                <Button onClick={handleNext} className="flex-1">
                  {currentQuestionIndex < assessmentQuestions.length - 1
                    ? 'Next Question'
                    : 'Complete Assessment'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
