'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  example: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  mastered: boolean;
}

const sampleVocabulary: VocabularyWord[] = [
  {
    id: '1',
    word: 'serendipity',
    definition:
      'The occurrence and development of events by chance in a happy or beneficial way',
    example: 'Finding that book was pure serendipity.',
    difficulty: 'advanced',
    category: 'abstract concepts',
    mastered: false,
  },
  {
    id: '2',
    word: 'ephemeral',
    definition: 'Lasting for a very short time; transitory',
    example: 'The beauty of cherry blossoms is ephemeral.',
    difficulty: 'advanced',
    category: 'descriptive',
    mastered: false,
  },
  {
    id: '3',
    word: 'ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    example: 'Smartphones have become ubiquitous in modern society.',
    difficulty: 'intermediate',
    category: 'technology',
    mastered: true,
  },
  {
    id: '4',
    word: 'eloquent',
    definition: 'Fluent or persuasive in speaking or writing',
    example: 'She gave an eloquent speech about climate change.',
    difficulty: 'intermediate',
    category: 'communication',
    mastered: false,
  },
  {
    id: '5',
    word: 'resilient',
    definition:
      'Able to withstand or recover quickly from difficult conditions',
    example: 'The community showed how resilient it was after the storm.',
    difficulty: 'intermediate',
    category: 'character traits',
    mastered: true,
  },
];

export default function VocabularyPage() {
  const [vocabulary, setVocabulary] =
    useState<VocabularyWord[]>(sampleVocabulary);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWord, setNewWord] = useState({
    word: '',
    definition: '',
    example: '',
    difficulty: 'intermediate' as const,
    category: '',
  });

  const filteredVocabulary = vocabulary.filter((word) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'mastered' && word.mastered) ||
      (filter === 'learning' && !word.mastered) ||
      word.difficulty === filter;

    const matchesSearch =
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleAddWord = () => {
    if (newWord.word && newWord.definition) {
      const word: VocabularyWord = {
        id: Date.now().toString(),
        ...newWord,
        mastered: false,
      };
      setVocabulary((prev) => [...prev, word]);
      setNewWord({
        word: '',
        definition: '',
        example: '',
        difficulty: 'intermediate',
        category: '',
      });
      setShowAddForm(false);
    }
  };

  const toggleMastered = (id: string) => {
    setVocabulary((prev) =>
      prev.map((word) =>
        word.id === id ? { ...word, mastered: !word.mastered } : word,
      ),
    );
  };

  const deleteWord = (id: string) => {
    setVocabulary((prev) => prev.filter((word) => word.id !== id));
  };

  const stats = {
    total: vocabulary.length,
    mastered: vocabulary.filter((w) => w.mastered).length,
    learning: vocabulary.filter((w) => !w.mastered).length,
    beginner: vocabulary.filter((w) => w.difficulty === 'beginner').length,
    intermediate: vocabulary.filter((w) => w.difficulty === 'intermediate')
      .length,
    advanced: vocabulary.filter((w) => w.difficulty === 'advanced').length,
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Vocabulary Library</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Manage your personal vocabulary collection and track your learning
          progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Words</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.mastered}
            </div>
            <div className="text-sm text-gray-600">Mastered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.learning}
            </div>
            <div className="text-sm text-gray-600">Learning</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {stats.beginner}
            </div>
            <div className="text-sm text-gray-600">Beginner</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {stats.intermediate}
            </div>
            <div className="text-sm text-gray-600">Intermediate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">
              {stats.advanced}
            </div>
            <div className="text-sm text-gray-600">Advanced</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search words..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Words</SelectItem>
            <SelectItem value="mastered">Mastered</SelectItem>
            <SelectItem value="learning">Learning</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setShowAddForm(true)}>Add Word</Button>
      </div>

      {/* Add Word Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Word</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Word"
                value={newWord.word}
                onChange={(e) =>
                  setNewWord((prev) => ({ ...prev, word: e.target.value }))
                }
              />
              <Select
                value={newWord.difficulty}
                onValueChange={(value: string) =>
                  setNewWord((prev) => ({ ...prev, difficulty: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Definition"
              value={newWord.definition}
              onChange={(e) =>
                setNewWord((prev) => ({ ...prev, definition: e.target.value }))
              }
            />
            <Input
              placeholder="Example sentence"
              value={newWord.example}
              onChange={(e) =>
                setNewWord((prev) => ({ ...prev, example: e.target.value }))
              }
            />
            <Input
              placeholder="Category (optional)"
              value={newWord.category}
              onChange={(e) =>
                setNewWord((prev) => ({ ...prev, category: e.target.value }))
              }
            />
            <div className="flex gap-2">
              <Button onClick={handleAddWord}>Add Word</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vocabulary List */}
      <div className="grid gap-4">
        {filteredVocabulary.map((word) => (
          <Card
            key={word.id}
            className={
              word.mastered
                ? 'border-green-200 bg-green-50 dark:bg-green-950'
                : ''
            }
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{word.word}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        word.difficulty === 'beginner'
                          ? 'bg-green-100 text-green-800'
                          : word.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {word.difficulty}
                    </span>
                    {word.mastered && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        ✓ Mastered
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    &ldquo;{word.word}&rdquo; - {word.definition}
                  </p>
                  {word.example && (
                    <p className="text-sm italic text-gray-500">
                      &ldquo;{word.example}&rdquo;
                    </p>
                  )}
                  {word.category && (
                    <p className="text-xs text-gray-400 mt-2">
                      Category: {word.category}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant={word.mastered ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => toggleMastered(word.id)}
                  >
                    {word.mastered ? 'Unmark' : 'Mark Mastered'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => deleteWord(word.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVocabulary.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No words found matching your criteria.
        </div>
      )}
    </div>
  );
}
