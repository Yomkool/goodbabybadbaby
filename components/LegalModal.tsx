import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

type LegalType = 'terms' | 'privacy';

interface LegalModalProps {
  visible: boolean;
  type: LegalType;
  onClose: () => void;
}

const TERMS_OF_SERVICE = `Last updated: January 2026

Welcome to Good Baby Bad Baby! These Terms of Service ("Terms") govern your use of our mobile application and services.

1. ACCEPTANCE OF TERMS

By accessing or using Good Baby Bad Baby, you agree to be bound by these Terms. If you do not agree, please do not use our services.

2. DESCRIPTION OF SERVICE

Good Baby Bad Baby is a social platform for sharing photos and videos of pets. Users can post content, like posts, follow pets, and participate in daily competitions.

3. USER ACCOUNTS

- You must be at least 13 years old to use this service
- You are responsible for maintaining the security of your account
- You are responsible for all activities that occur under your account
- You must provide accurate information when creating an account

4. USER CONTENT

- You retain ownership of content you post
- By posting, you grant us a license to display your content on the platform
- You must not post content that infringes on others' rights
- You must not post inappropriate, harmful, or illegal content
- We reserve the right to remove content that violates these terms

5. ACCEPTABLE USE

You agree not to:
- Use the service for any illegal purpose
- Harass, abuse, or harm other users
- Post spam or misleading content
- Attempt to manipulate voting or rankings
- Create multiple accounts for deceptive purposes
- Reverse engineer or exploit the application

6. PET CONTENT GUIDELINES

- Only post content of pets you own or have permission to share
- Do not post content depicting animal cruelty or harm
- Ensure your pets are treated humanely in all content

7. COMPETITIONS AND RANKINGS

- Daily "Good Baby" and "Bad Baby" competitions are for entertainment
- Rankings are determined by our algorithms and community votes
- We reserve the right to disqualify entries that violate our guidelines

8. PREMIUM FEATURES

- Some features require a paid subscription
- Subscriptions auto-renew unless cancelled
- Refunds are handled according to app store policies

9. TERMINATION

We may suspend or terminate your account for violations of these Terms without prior notice.

10. DISCLAIMER

The service is provided "as is" without warranties of any kind. We are not responsible for user-generated content.

11. LIMITATION OF LIABILITY

To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages.

12. CHANGES TO TERMS

We may update these Terms at any time. Continued use after changes constitutes acceptance.

13. CONTACT

For questions about these Terms, please contact us at support@goodbabybadbaby.app`;

const PRIVACY_POLICY = `Last updated: January 2026

Good Baby Bad Baby ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your information.

1. INFORMATION WE COLLECT

Account Information:
- Email address
- Display name
- Profile picture (optional)

Pet Information:
- Pet names
- Pet species
- Pet photos and videos

Usage Information:
- Posts, likes, and follows
- App usage patterns
- Device information

2. HOW WE USE YOUR INFORMATION

We use your information to:
- Provide and improve our services
- Personalize your experience
- Process transactions
- Send notifications (with your consent)
- Ensure platform safety and security
- Analyze usage trends

3. SHARING YOUR INFORMATION

We may share your information with:
- Other users (public profile and posts)
- Service providers who assist our operations
- Legal authorities when required by law

We do NOT sell your personal information to third parties.

4. PUBLIC CONTENT

- Posts, pet profiles, and usernames are public by default
- Other users can see your posts and interactions
- Think carefully before posting personal information

5. DATA RETENTION

- Account data is retained while your account is active
- You can request deletion of your account and data
- Some data may be retained for legal compliance

6. DATA SECURITY

We implement reasonable security measures to protect your data, including:
- Encrypted data transmission
- Secure data storage
- Regular security assessments

7. YOUR RIGHTS

You have the right to:
- Access your personal data
- Correct inaccurate data
- Delete your account and data
- Opt out of marketing communications
- Export your data

8. CHILDREN'S PRIVACY

Our service is not intended for children under 13. We do not knowingly collect data from children under 13.

9. THIRD-PARTY SERVICES

Our app may contain links to third-party services. We are not responsible for their privacy practices.

10. ANALYTICS AND ADVERTISING

We may use analytics services to understand app usage. We may display ads from third-party networks. You can opt out of personalized advertising in your device settings.

11. COOKIES AND TRACKING

We use standard technologies to enhance your experience and analyze usage patterns.

12. INTERNATIONAL USERS

Your data may be processed in countries other than your own. By using our service, you consent to this transfer.

13. CHANGES TO THIS POLICY

We may update this Privacy Policy periodically. We will notify you of significant changes.

14. CONTACT US

For privacy-related questions or requests:
Email: privacy@goodbabybadbaby.app

15. CALIFORNIA RESIDENTS

California residents have additional rights under the CCPA. Contact us to exercise these rights.`;

export default function LegalModal({ visible, type, onClose }: LegalModalProps) {
  const insets = useSafeAreaInsets();
  const title = type === 'terms' ? 'Terms of Service' : 'Privacy Policy';
  const content = type === 'terms' ? TERMS_OF_SERVICE : PRIVACY_POLICY;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={24} color="#333" />
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        >
          <Text style={styles.text}>{content}</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },
});
