import sys
sys.path.append('./logic')

import unittest
from conversation import Conversation
from message import Message

class TestConversation(unittest.TestCase):
    def test_get(self):
        m = Message("Hallo", "system")
        c = Conversation("de", [m])
        self.assertEqual(c.get(), [m])

    def test_add(self):
        c = Conversation("de", [])
        m = Message("Hallo", "system")
        c.add(m)
        self.assertEqual(c.get(), [m])

    

if __name__ == '__main__':
    unittest.main()