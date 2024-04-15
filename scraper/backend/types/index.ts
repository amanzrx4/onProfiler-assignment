interface Profile {
  bio: {
    text: string;
    mentions: any[]; // Define type if needed
    channelMentions: any[]; // Define type if needed
  };
  location: {
    placeId: string;
    description: string;
  };
}

interface User {
  fid: number;
  username: string;
  displayName: string;
  pfp: {
    url: string;
    verified: boolean;
  };
  profile: Profile;
  followerCount: number;
  followingCount: number;
  activeOnFcNetwork: boolean;
}

interface Tag {
  type: string;
  id: string;
  name: string;
  imageUrl: string;
}

interface Message {
  hash: string;
  threadHash: string;
  parentHash: string;
  parentAuthor: User;
  author: User;
  text: string;
  timestamp: number;
  replies: {
    count: number;
  };
  reactions: {
    count: number;
  };
  recasts: {
    count: number;
    recasters: User[];
  };
  watches: {
    count: number;
  };
  tags: Tag[];
  quoteCount: number;
  combinedRecastCount: number;
  embeds?: any;
  //   parentSource?: any;
}

export interface CastResponse {
  result: {
    casts: Message[];
  };
  next?: {
    cursor: string;
  };
}

// const exampleMessage: Message = {
//   hash: "0xd70652b1ef51547783d9322c7edffc3494aa93ea",
//   threadHash: "0xa2e5ffbbe1827558c838e1d73087cca60b1edc86",
//   parentHash: "0xa2e5ffbbe1827558c838e1d73087cca60b1edc86",
//   parentAuthor: {
//     fid: 394856,
//     username: "peneie",
//     displayName: "ペネ家🎩🟣🍖🧀",
//     pfp: {
//       url: "https://i.imgur.com/exFTw0q.jpg",
//       verified: false,
//     },
//     profile: {
//       bio: {
//         text: "暗号資産で家を買う予定🤣英語アレルギーw🎩貰ったら返します❗️（ペナ対策で時間差）ラーメンが好き🍜あとXやってます→ https://x.com/sisiza5982/status/1609203254545584131?s=46",
//         mentions: [],
//         channelMentions: [],
//       },
//       location: {
//         placeId: "",
//         description: "",
//       },
//     },
//     followerCount: 1067,
//     followingCount: 1153,
//     activeOnFcNetwork: false,
//   },
//   author: {
//     fid: 422975,
//     username: "buzass",
//     displayName: "buzass",
//     pfp: {
//       url: "https://i.imgur.com/wrrtygV.jpg",
//       verified: false,
//     },
//     profile: {
//       bio: {
//         text: "I want to have a 1 bitcoin\n\npiz...",
//         mentions: [],
//         channelMentions: [],
//       },
//       location: {
//         placeId: "",
//         description: "",
//       },
//     },
//     followerCount: 1413,
//     followingCount: 1236,
//     activeOnFcNetwork: false,
//   },
//   text: "hi yo\n\n23 $degen",
//   timestamp: 1712737640000,
//   replies: {
//     count: 1,
//   },
//   reactions: {
//     count: 1,
//   },
//   recasts: {
//     count: 0,
//     recasters: [],
//   },
//   watches: {
//     count: 0,
//   },
//   tags: [
//     {
//       type: "channel",
//       id: "japan777iine",
//       name: "japan777iine",
//       imageUrl: "https://i.imgur.com/WwxzqHL.jpg",
//     },
//   ],
//   quoteCount: 0,
//   combinedRecastCount: 0,
// };

interface Pfp {
  url: string;
  verified: boolean;
}

interface ViewerContext {
  following: boolean;
  followedBy: boolean;
  canSendDirectCasts: boolean;
  enableNotifications: boolean;
  hasUploadedInboxKeys: boolean;
}

interface User {
  fid: number;
  username: string;
  displayName: string;
  pfp: Pfp;
  profile: Profile;
  followerCount: number;
  followingCount: number;
  activeOnFcNetwork: boolean;
  viewerContext: ViewerContext;
}

interface Result {
  user: User;
  collectionsOwned: any[];
  extras: {
    fid: number;
    custodyAddress: string;
  };
}

export interface ProfileResponse {
  result: Result;
}

// <div class="inline-block animate-spin rounded-full border-current border-t-transparent opacity-50 text-default h-6 w-6 border-[3px]" role="status" aria-label="loading"></div>
