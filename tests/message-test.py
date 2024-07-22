import sys
sys.path.append('./logic')

import unittest
from message import Message


class TestMessage(unittest.TestCase):
    def test_message(self):
        m = Message("Hello", "system")
        self.assertEqual(m.content, "Hello")
        self.assertEqual(m.role, "system")

    def test_to_json(self):
        m = Message("Hello", "system")
        self.assertEqual(m.to_json(), {'role': 'system', 'content': 'Hello'})

    def test_assistant_message_to_dict_converts(self):
        m = Message('{"en": "Hello"}', "assistant")
        self.assertEqual(m.assistant_message_to_dict(), {"en": "Hello"})

    def test_assistant_message_to_dict_returns_none(self):
        m = Message("Hello", "user")
        self.assertEqual(m.assistant_message_to_dict(), None)

if __name__ == '__main__':
    unittest.main()