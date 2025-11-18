export interface RandomUser {
  name: {
    first: string;
    last: string;
  };
  email: string;
  picture: {
    thumbnail: string;
  };
  login: {
    uuid: string;
    username: string;
  };
}

export interface RandomUserResponse {
  results: RandomUser[];
  info: {
    seed: string;
  };
}

export async function fetchRandomUsers(count: number = 1): Promise<RandomUser[]> {
  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}&inc=name,email,picture,login`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch random users');
    }

    const data: RandomUserResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching random users:', error);
    throw error;
  }
}

