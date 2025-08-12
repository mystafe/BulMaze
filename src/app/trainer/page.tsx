import VocabTrainer from '@/components/VocabTrainer';

export default function TrainerPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Vocabulary Trainer</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Learn English vocabulary using spaced repetition. Review words at
          optimal intervals to maximize retention.
        </p>
      </div>
      <VocabTrainer />
    </div>
  );
}
