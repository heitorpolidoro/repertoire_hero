import React from 'react';
import type { PracticeLevel } from './types';
import { FaCompass, FaShoePrints, FaCogs, FaThumbsUp, FaBrain, FaTrophy } from 'react-icons/fa';

export const PRACTICE_LEVELS: PracticeLevel[] = [
  {
    level: 0,
    title: "Discovery",
    icon: <FaCompass className="inline-block mr-2" />,
    color: 'text-gray-400',
    bgColor: 'bg-gray-700'
  },
  {
    level: 1,
    title: "First Steps",
    icon: <FaShoePrints className="inline-block mr-2" />,
    color: 'text-red-400',
    bgColor: 'bg-red-900'
  },
  {
    level: 2,
    title: "Getting There",
    icon: <FaCogs className="inline-block mr-2" />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-900'
  },
  {
    level: 3,
    title: "Confident",
    icon: <FaThumbsUp className="inline-block mr-2" />,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-900'
  },
  {
    level: 4,
    title: "Flow State",
    icon: <FaBrain className="inline-block mr-2" />,
    color: 'text-lime-400',
    bgColor: 'bg-lime-900'
  },
  {
    level: 5,
    title: "Mastered",
    icon: <FaTrophy className="inline-block mr-2" />,
    color: 'text-green-400',
    bgColor: 'bg-green-900'
  }
];

export const LEVEL_HOVER_CLASSES: { [key: number]: string } = {
  0: 'hover:bg-gray-700',
  1: 'hover:bg-red-900',
  2: 'hover:bg-orange-900',
  3: 'hover:bg-yellow-900',
  4: 'hover:bg-lime-900',
  5: 'hover:bg-green-900',
};

export const getLevelDetails = (level: number): PracticeLevel => {
  return PRACTICE_LEVELS.find(l => l.level === level) || PRACTICE_LEVELS[0];
};