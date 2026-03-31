export const DSA_PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays, Hash Table",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    starterCode: {
      python: "def two_sum(nums, target):\n    # Write your code here\n    pass",
      cpp: "vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n}",
      java: "public int[] twoSum(int[] nums, int target) {\n    // Write your code here\n}",
      c: "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n}"
    },
    testCases: [
      { is_sample: true, input: "[2,7,11,15]\n9", expected_output: "[0,1]" },
      { is_sample: true, input: "[3,2,4]\n6", expected_output: "[1,2]" },
      { is_sample: false, input: "[3,3]\n6", expected_output: "[0,1]" },
      { is_sample: false, input: "[-1,-2,-3,-4,-5]\n-8", expected_output: "[2,4]" }
    ]
  },
  {
    id: 2,
    title: "Reverse String",
    difficulty: "Easy",
    topic: "Strings",
    description: "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
    examples: [
      {
        input: "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]",
        output: "[\"o\",\"l\",\"l\",\"e\",\"h\"]"
      }
    ],
    constraints: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ascii character."
    ],
    starterCode: {
      python: "def reverse_string(s):\n    # Write your code here\n    pass",
      cpp: "void reverseString(vector<char>& s) {\n    // Write your code here\n}",
      java: "public void reverseString(char[] s) {\n    // Write your code here\n}",
      c: "void reverseString(char* s, int sSize) {\n    // Write your code here\n}"
    },
    testCases: [
      { is_sample: true, input: "[\"h\",\"e\",\"l\",\"l\",\"o\"]", expected_output: "[\"o\",\"l\",\"l\",\"e\",\"h\"]" },
      { is_sample: false, input: "[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", expected_output: "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]" }
    ]
  },
  {
    id: 3,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topic: "Linked List",
    description: "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]"
      }
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    starterCode: {
      python: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef merge_two_lists(list1, list2):\n    # Write your code here\n    pass",
      cpp: "ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Write your code here\n}",
      java: "public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n    // Write your code here\n}",
      c: "struct ListNode* mergeTwoLists(struct ListNode* list1, struct ListNode* list2) {\n    // Write your code here\n}"
    },
    testCases: [
      { is_sample: true, input: "[1,2,4]\n[1,3,4]", expected_output: "[1,1,2,3,4,4]" },
      { is_sample: false, input: "[]\n[]", expected_output: "[]" }
    ]
  },
  {
    id: 4,
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      {
        input: "s = '()'",
        output: "true"
      },
      {
        input: "s = '()[]{}'",
        output: "true"
      },
      {
        input: "s = '(]'",
        output: "false"
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    starterCode: {
      python: "def is_valid(s):\n    # Write your code here\n    pass",
      cpp: "bool isValid(string s) {\n    // Write your code here\n}",
      java: "public boolean isValid(String s) {\n    // Write your code here\n}",
      c: "bool isValid(char * s) {\n    // Write your code here\n}"
    },
    testCases: [
      { is_sample: true, input: "()", expected_output: "true" },
      { is_sample: true, input: "(]", expected_output: "false" },
      { is_sample: false, input: "([{}])", expected_output: "true" },
      { is_sample: false, input: "(([])", expected_output: "false" }
    ]
  },
  {
    id: 5,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Hash Table, Two Pointers, String, Sliding Window",
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: "s = 'abcabcbb'",
        output: "3",
        explanation: "The answer is 'abc', with the length of 3."
      },
      {
        input: "s = 'bbbbb'",
        output: "1",
        explanation: "The answer is 'b', with the length of 1."
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    starterCode: {
      python: "def length_of_longest_substring(s):\n    # Write your code here\n    pass",
      cpp: "int lengthOfLongestSubstring(string s) {\n    // Write your code here\n}",
      java: "public int lengthOfLongestSubstring(String s) {\n    // Write your code here\n}",
      c: "int lengthOfLongestSubstring(char * s) {\n    // Write your code here\n}"
    },
    testCases: [
      { is_sample: true, input: "abcabcbb", expected_output: "3" },
      { is_sample: false, input: "pwwkew", expected_output: "3" },
      { is_sample: false, input: "", expected_output: "0" }
    ]
  },
  {
    id: 6,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topic: "Tree, Breadth-First Search",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]"
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    starterCode: {
      python: "def level_order(root):\n    # Write your code here\n    pass",
      cpp: "vector<vector<int>> levelOrder(TreeNode* root) {\n    // Write your code here\n}",
      java: "public List<List<Integer>> levelOrder(TreeNode root) {\n    // Write your code here\n}",
      c: "int** levelOrder(struct TreeNode* root, int* returnSize, int** returnColumnSizes) {\n    // Write your code here\n}"
    },
    testCases: [
      { is_sample: true, input: "[3,9,20,null,null,15,7]", expected_output: "[[3],[9,20],[15,7]]" },
      { is_sample: false, input: "[1]", expected_output: "[[1]]" },
      { is_sample: false, input: "[]", expected_output: "[]" }
    ]
  },
  {
    id: 7,
    title: "Container With Most Water",
    difficulty: "Medium",
    topic: "Array, Two Pointers",
    description: "You are given an integer array height of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `ith` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\nNotice that you may not slant the container.",
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49."
      }
    ],
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    starterCode: {
      python: "def max_area(height):\n    # Write your code here\n    pass",
      cpp: "int maxArea(vector<int>& height) {\n    // Write your code here\n}",
      java: "public int maxArea(int[] height) {\n    // Write your code here\n}",
      c: "int maxArea(int* height, int heightSize) {\n    // Write your code here\n}"
    },
    testCases: [
      { is_sample: true, input: "[1,8,6,2,5,4,8,3,7]", expected_output: "49" },
      { is_sample: false, input: "[1,1]", expected_output: "1" },
      { is_sample: false, input: "[4,3,2,1,4]", expected_output: "16" }
    ]
  },
  {
    id: 8,
    title: "Word Break",
    difficulty: "Medium",
    topic: "Hash Table, String, Dynamic Programming, Trie, Memoization",
    description: "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.",
    examples: [
      {
        input: "s = 'leetcode', wordDict = ['leet','code']",
        output: "true",
        explanation: "Return true because 'leetcode' can be segmented as 'leet code'."
      },
      {
        input: "s = 'applepenapple', wordDict = ['apple','pen']",
        output: "true",
        explanation: "Return true because 'applepenapple' can be segmented as 'apple pen apple'. Note that you are allowed to reuse a dictionary word."
      }
    ],
    constraints: [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000",
      "1 <= wordDict[i].length <= 20",
      "s and wordDict[i] consist of only lowercase English letters.",
      "All the strings of wordDict are unique."
    ],
    starterCode: {
      python: "def word_break(s, wordDict):\n    # Write your code here\n    pass",
      cpp: "bool wordBreak(string s, vector<string>& wordDict) {\n    // Write your code here\n}",
      java: "public boolean wordBreak(String s, List<String> wordDict) {\n    // Write your code here\n}",
      c: "bool wordBreak(char * s, char ** wordDict, int wordDictSize) {\n    // Write your code here\n}"
    },
    testCases: [
      { is_sample: true, input: "leetcode\n['leet','code']", expected_output: "true" },
      { is_sample: false, input: "catsandog\n['cats','dog','sand','and','cat']", expected_output: "false" }
    ]
  },
  {
    id: 9,
    title: "LRU Cache",
    difficulty: "Medium",
    topic: "Hash Table, Linked List, Design, Doubly-Linked List",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n\n*   `LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.\n*   `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n*   `void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, evict the least recently used key.\n\nThe functions `get` and `put` must each run in `O(1)` average time complexity.",
    examples: [
      {
        input: "['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get']\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]",
        output: "[null, null, null, 1, null, -1, null, -1, 3, 4]",
        explanation: "LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); // cache is {1=1}\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4"
      }
    ],
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4",
      "0 <= value <= 10^5",
      "At most 2 * 10^5 calls will be made to get and put."
    ],
    starterCode: {
      python: "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        pass\n    def put(self, key: int, value: int) -> None:\n        pass",
      cpp: "class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) {}\n    void put(int key, int value) {}\n};",
      java: "class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) {}\n    public void put(int key, int value) {}\n}",
      c: "typedef struct {\n    // Define properties\n} LRUCache;\n\nLRUCache* lRUCacheCreate(int capacity) {}\nint lRUCacheGet(LRUCache* obj, int key) {}\void lRUCachePut(LRUCache* obj, int key, int value) {}\nvoid lRUCacheFree(LRUCache* obj) {}"
    },
    testCases: [
      { is_sample: true, input: "['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get']\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]", expected_output: "[null, null, null, 1, null, -1, null, -1, 3, 4]" }
    ]
  },
  {
    id: 10,
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    topic: "Linked List, Divide and Conquer, Heap (Priority Queue), Merge Sort",
    description: "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.",
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
        explanation: "The linked-lists are:\n[\n  1->4->5,\n  1->3->4,\n  2->6\n]\nmerging them into one sorted list:\n1->1->2->3->4->4->5->6"
      }
    ],
    constraints: [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4",
      "lists[i] is sorted in ascending order.",
      "The sum of lists[i].length will not exceed 10^4."
    ],
    starterCode: {
      python: "def merge_k_lists(lists):\n    # Write your code here\n    pass",
      cpp: "ListNode* mergeKLists(vector<ListNode*>& lists) {\n    // Write your code here\n}",
      java: "public ListNode mergeKLists(ListNode[] lists) {\n    // Write your code here\n}",
      c: "struct ListNode* mergeKLists(struct ListNode** lists, int listsSize) {\n    // Write your code here\n}"
    },
    testCases: [
      { is_sample: true, input: "[[1,4,5],[1,3,4],[2,6]]", expected_output: "[1,1,2,3,4,4,5,6]" },
      { is_sample: false, input: "[]", expected_output: "[]" },
      { is_sample: false, input: "[[]]", expected_output: "[]" }
    ]
  }
];
