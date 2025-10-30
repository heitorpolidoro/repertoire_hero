import { UserProfile } from '../types';

export const fetchUserProfile = (): Promise<UserProfile> => {
  const userProfile: UserProfile = {
    name: 'Alex Doe',
    instrument: 'Guitar',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userProfile);
    }, 500); // Simulate a 500ms network delay
  });
};
