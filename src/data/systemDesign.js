export const SYSTEM_DESIGN_CASES = [
  {
    id: 'whatsapp',
    title: 'Design WhatsApp',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    description: 'Design a scalable chat application like WhatsApp. Focus on real-time messaging, status updates, and minimal latency.',
    requirements: {
      functional: [
        'Support one-on-one and group messaging.',
        'Show user status (online/offline) and last seen.',
        'Message acknowledgment (sent, delivered, read).',
        'Support push notifications.'
      ],
      nonFunctional: [
        'Highly available (system shouldn’t go down).',
        'Low latency (real-time experience).',
        'Highly consistent (messages should not be out of order).',
        'Scale to handle billions of users and messages per day.'
      ]
    },
    clarifications: [
      {
        question: 'Do we need to support media (images, videos)?',
        options: ['Yes, full media support', 'No, text-only for now'],
        correct: 0,
        explanation: 'In a real interview, you clarify scope. Let’s assume full media support to discuss object storage (S3) and CDNs.'
      },
      {
        question: 'Are messages stored permanently on the server?',
        options: ['Yes, forever', 'No, only until delivered'],
        correct: 1,
        explanation: 'WhatsApp stores messages temporarily until they are delivered, then deletes them from the server to save space and ensure privacy (end-to-end encryption).'
      }
    ],
    keyComponents: [
      { name: 'API Gateway', desc: 'Entry point for clients, handles authentication and rate limiting.' },
      { name: 'Chat Servers', desc: 'Maintains long-lived WebSocket connections with active users.' },
      { name: 'Presence Servers', desc: 'Manages user online/offline status.' },
      { name: 'Message Queue', desc: 'Handles async message delivery (e.g., Kafka or RabbitMQ) when users are offline.' },
      { name: 'Database (NoSQL)', desc: 'Cassandra or DynamoDB for fast distributed message storage.' },
      { name: 'Object Storage & CDN', desc: 'S3 for storing media, CDN for fast global delivery.' }
    ],
    concepts: [
      { title: 'WebSockets', desc: 'Bi-directional, full-duplex communication over a single TCP connection. Essential for real-time chat.' },
      { title: 'Cassandra DB', desc: 'Wide-column NoSQL database. Perfect for write-heavy workloads like chatting.' },
      { title: 'Consistent Hashing', desc: 'Used for load balancing connections across multiple Chat Servers efficiently.' }
    ]
  },
  {
    id: 'youtube',
    title: 'Design YouTube',
    difficulty: 'Advanced',
    estimatedTime: '60 mins',
    description: 'Design a video sharing platform like YouTube. Focus on video uploading, processing, and streaming at massive scale.',
    requirements: {
      functional: [
        'Users can upload videos.',
        'Users can search and view videos.',
        'Record stats like views, likes, and comments.',
        'Video recommendation.'
      ],
      nonFunctional: [
        'Highly reliable (no single point of failure).',
        'Highly available (viewing should never fail).',
        'Low latency for video playback.',
        'Massive storage and bandwidth handling.'
      ]
    },
    clarifications: [
      {
        question: 'What is the read-to-write ratio?',
        options: ['100:1 (Read heavy)', '1:1 (Balanced)'],
        correct: 0,
        explanation: 'YouTube is extremely read-heavy. A 100:1 or even higher ratio dictates heavy reliance on CDNs and caching.'
      }
    ],
    keyComponents: [
      { name: 'CDN', desc: 'Content Delivery Network to cache and serve videos close to the user.' },
      { name: 'Transcoding Servers', desc: 'Worker nodes that process uploaded videos into different formats and resolutions (e.g., 360p, 720p, 1080p).' },
      { name: 'Metadata Database', desc: 'SQL (MySQL/PostgreSQL) with sharding or reliable NoSQL to store video info, user info, comments.' },
      { name: 'Search Engine', desc: 'Elasticsearch to index video metadata and power the search bar.' }
    ],
    concepts: [
      { title: 'Video Encoding/Transcoding', desc: 'Converting raw video files into standardized formats (like HLS or DASH) suitable for streaming.' },
      { title: 'CDN Edge Nodes', desc: 'Servers physically located closer to users that cache static assets (videos) to reduce latency and origin server load.' }
    ]
  },
  {
    id: 'uber',
    title: 'Design Uber',
    difficulty: 'Advanced',
    estimatedTime: '60 mins',
    description: 'Design a ride-hailing service like Uber. Focus on real-time location tracking and driver-rider matching.',
    requirements: {
      functional: [
        'Riders can request a ride and see estimated price.',
        'Drivers nearby are notified and can accept/reject.',
        'Real-time location tracking of the driver.',
        'Trip status updates.'
      ],
      nonFunctional: [
        'Low latency matching.',
        'High reliability and consistency in trip state.',
        'Scalable to millions of concurrent drivers and riders.'
      ]
    },
    clarifications: [
      {
        question: 'How do we track driver locations?',
        options: ['Drivers send location every 3 seconds', 'Riders pull location every 1 minute'],
        correct: 0,
        explanation: 'Drivers frequently ping their location via WebSockets/HTTP POST to the location service.'
      }
    ],
    keyComponents: [
      { name: 'Location Service', desc: 'Ingests location updates from drivers.' },
      { name: 'Matching Service', desc: 'Finds nearest available drivers using a QuadTree or Geohash system.' },
      { name: 'Trip Management', desc: 'State machine managing the trip (Requested -> Accepted -> Ongoing -> Completed).' },
      { name: 'Geospatial DB', desc: 'Redis with Geo hashing or specialized spatial databases.' }
    ],
    concepts: [
      { title: 'Geohashing', desc: 'Encoding geographic coordinates (lat/long) into a short string. Useful for proximity searches.' },
      { title: 'QuadTree', desc: 'A tree data structure used to partition two-dimensional space by recursively subdividing it into four quadrants.' }
    ]
  },
  {
    id: 'url-shortener',
    title: 'Design URL Shortener',
    difficulty: 'Beginner',
    estimatedTime: '30 mins',
    description: 'Design a service like TinyURL that takes a long URL and generates a short, unique alias.',
    requirements: {
      functional: [
        'Generate a unique short URL given a long URL.',
        'Redirect short URL to the original long URL.',
        'Short URLs should expire after a standard default timespan.'
      ],
      nonFunctional: [
        'Highly available.',
        'URL redirection should have minimal latency.',
        'Short URLs should not be predictable.'
      ]
    },
    clarifications: [
      {
        question: 'How long should the short URL be?',
        options: ['7 characters (Base62)', '20 characters (UUID)'],
        correct: 0,
        explanation: '7 characters in Base62 (A-Z, a-z, 0-9) gives ~3.5 trillion URLs, which is usually sufficient and user-friendly.'
      }
    ],
    keyComponents: [
      { name: 'API Server', desc: 'Handles short URL generation and redirection requests.' },
      { name: 'Key Generation Service (KGS)', desc: 'Pre-generates unique short strings to avoid race conditions and database collisions.' },
      { name: 'Database', desc: 'NoSQL (like DynamoDB or MongoDB) or RDBMS to store ShortURL -> LongURL mappings.' },
      { name: 'Cache', desc: 'Redis or Memcached to store frequent mappings for fast redirection (read-heavy).' }
    ],
    concepts: [
      { title: 'Base62 Encoding', desc: 'Converting numeric IDs into a string of 62 alphanumeric characters.' },
      { title: 'CAP Theorem', desc: 'For this system, we prioritize Availability and Partition tolerance over strong Consistency (AP system).' }
    ]
  }
];
