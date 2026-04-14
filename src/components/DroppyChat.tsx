import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Animated,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  'What services do you offer?',
  'How does membership work?',
  'Where are you located?',
  'Can I book without a membership?',
];

const INITIAL_RESPONSES: Record<string, string> = {
  'What services do you offer?': 
    'NEOVIV offers 12 different IV therapy services including Myers\' Cocktail, NAD+, Immunity Boost, Hydration, Energy & Vitality, Glutathione, Beauty Glow, Recovery, Hangover Relief, Weight Loss, Anti-Aging, and Migraine Relief. All treatments are administered by licensed nurses!',
  'How does membership work?':
    'NEOVIV has two membership tiers:\n\n• Essential: $399/month - 10% off all IV services, dedicated nurse, secure messaging\n\n• Elite: $799/month - 3 IV sessions included, 20% off everything, priority booking, VIP concierge line\n\nBoth include Life Points rewards!',
  'Where are you located?':
    'NEOVIV\'s main Miami clinic is at 1950 SW 27 Ave, Miami, FL 33145. Our concierge nurses also travel to you anywhere in Florida - at home, your hotel, or office!',
  'Can I book without a membership?':
    'Yes! You can book a single infusion without a membership. Just select your drip, choose a time, and we\'ll come to you or you can visit our Miami clinic. No membership required!',
};

export default function DroppyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m Droppy 💧 — NEOVIV\'s assistant. I can answer any questions about our IV therapy services, membership plans, or how to book. What can I help you with?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  
  const bounceAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(100))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Bounce animation for the floating button
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setIsOpen(false));
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userText = message.trim();
    setMessage('');

    // Simulate response
    setTimeout(() => {
      let responseText = INITIAL_RESPONSES[userText];
      
      if (!responseText) {
        if (userText.toLowerCase().includes('price') || userText.toLowerCase().includes('cost')) {
          responseText = 'Our single infusions range from $199-$399 depending on the drip. Memberships start at $399/month for Essential tier. Would you like to learn more about our membership options?';
        } else if (userText.toLowerCase().includes('book') || userText.toLowerCase().includes('appointment')) {
          responseText = 'You can book a session through the app! Tap "Book a Visit" on the home screen, select your drip, choose a time, and we\'ll confirm your appointment. Same-day booking available!';
        } else if (userText.toLowerCase().includes('nurse') || userText.toLowerCase().includes('who')) {
          responseText = 'All NEOVIV nurses are licensed healthcare professionals. They\'re certified in IV therapy and trained to provide premium concierge care. Your nurse will be assigned when you book!';
        } else {
          responseText = 'Thanks for your question! For specific details about our services, membership, or booking, I\'d recommend checking the app or speaking with your assigned nurse. Is there anything else I can help with?';
        }
      }

      const droppyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, droppyMessage]);
    }, 800);
  };

  const handleSuggestedQuestion = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const responseText = INITIAL_RESPONSES[question] || 
        'Thanks for your question! For more details, feel free to explore the app or contact our team.';

      const droppyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, droppyMessage]);
    }, 800);
  };

  return (
    <>
      {/* Floating Droppy Button */}
      <Animated.View style={[styles.floatingButton, { transform: [{ translateY: bounceAnim }] }]}>
        <Pressable 
          style={styles.droppyButton}
          onPress={toggleChat}
        >
          <Text style={styles.droppyButtonText}>💧</Text>
          <View style={styles.onlineIndicator} />
        </Pressable>
      </Animated.View>

      {/* Chat Modal */}
      <Modal visible={isOpen} transparent animationType='none'>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <Animated.View style={[
            styles.chatContainer,
            { transform: [{ translateY: slideAnim }], opacity: fadeAnim }
          ]}>
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <BlurView intensity={25} tint='dark' style={styles.chatHeaderBlur}>
                <View style={styles.chatHeaderContent}>
                  <View style={styles.chatHeaderLeft}>
                    <Text style={styles.chatHeaderEmoji}>💧</Text>
                    <View>
                      <Text style={styles.chatHeaderTitle}>Droppy</Text>
                      <Text style={styles.chatHeaderSubtitle}>NEOVIV Assistant · Always here</Text>
                    </View>
                  </View>
                  <Pressable style={styles.closeButton} onPress={toggleChat}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </Pressable>
                </View>
              </BlurView>
            </View>

            {/* Messages */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
            >
              {messages.map((msg) => (
                <View 
                  key={msg.id}
                  style={[
                    styles.messageBubble,
                    msg.isUser ? styles.userBubble : styles.droppyBubble
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    msg.isUser ? styles.userMessageText : styles.droppyMessageText
                  ]}>
                    {msg.text}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Suggested Questions */}
            {!messages.some(m => m.isUser) && (
              <View style={styles.suggestedContainer}>
                <Text style={styles.suggestedLabel}>Suggested questions:</Text>
                <View style={styles.suggestedRow}>
                  {SUGGESTED_QUESTIONS.slice(0, 2).map((q, i) => (
                    <Pressable
                      key={i}
                      style={styles.suggestedButton}
                      onPress={() => handleSuggestedQuestion(q)}
                    >
                      <Text style={styles.suggestedButtonText}>{q}</Text>
                    </Pressable>
                  ))}
                </View>
                <View style={styles.suggestedRow}>
                  {SUGGESTED_QUESTIONS.slice(2, 4).map((q, i) => (
                    <Pressable
                      key={i}
                      style={styles.suggestedButton}
                      onPress={() => handleSuggestedQuestion(q)}
                    >
                      <Text style={styles.suggestedButtonText}>{q}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder='Type a message...'
                placeholderTextColor='#666'
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={handleSend}
                multiline
              />
              <Pressable 
                style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!message.trim()}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 50,
  },
  droppyButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: TEAL,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  droppyButtonText: {
    fontSize: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: BLACK,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    height: '80%',
    backgroundColor: BLACK,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  chatHeader: {},
  chatHeaderBlur: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  chatHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    color: TEAL,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: TEAL,
    borderBottomRightRadius: 4,
  },
  droppyBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: BLACK,
    fontWeight: '500',
  },
  droppyMessageText: {
    color: '#FFFFFF',
  },
  suggestedContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  suggestedLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  suggestedRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  suggestedButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 176, 155, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: TEAL + '30',
  },
  suggestedButtonText: {
    fontSize: 12,
    color: TEAL,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#FFFFFF',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: TEAL,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: BLACK,
  },
});