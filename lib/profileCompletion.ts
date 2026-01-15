import { User } from '@/types';

/**
 * Check if user profile is 100% complete for ID card eligibility
 * Required fields:
 * - name, age, gender, email, phone, address (basic)
 * - emergencyContact, emergencyPhone (guardian info)
 * - At least one social media profile (facebook, instagram, twitter, or linkedin)
 */
export function isProfileCompleteForIDCard(user: User | null): boolean {
  if (!user) return false;

  // Basic required fields
  const hasBasicInfo = !!(
    user.name &&
    user.age &&
    user.gender &&
    user.email &&
    user.phone &&
    user.address
  );

  // Guardian/emergency contact info (required)
  const hasGuardianInfo = !!(
    user.emergencyContact &&
    user.emergencyPhone
  );

  // At least one social media profile (required)
  const hasSocialMedia = !!(
    user.facebook ||
    user.instagram ||
    user.twitter ||
    user.linkedin
  );

  return hasBasicInfo && hasGuardianInfo && hasSocialMedia;
}

/**
 * Get profile completion percentage
 */
export function getProfileCompletionPercentage(user: User | null): number {
  if (!user) return 0;

  const fields = [
    user.name,
    user.age,
    user.gender,
    user.email,
    user.phone,
    user.address,
    user.dateOfBirth,
    user.nid,
    user.emergencyContact,
    user.emergencyPhone,
    user.bloodGroup,
    user.occupation,
    user.education,
    user.facebook,
    user.instagram,
    user.twitter,
    user.linkedin,
  ];

  const filledFields = fields.filter(field => field && field !== '').length;
  return Math.round((filledFields / fields.length) * 100);
}

/**
 * Get missing fields for ID card eligibility
 */
export function getMissingFieldsForIDCard(user: User | null): string[] {
  if (!user) return ['সব তথ্য'];

  const missing: string[] = [];

  if (!user.name) missing.push('নাম');
  if (!user.age) missing.push('বয়স');
  if (!user.gender) missing.push('লিঙ্গ');
  if (!user.email) missing.push('ইমেইল');
  if (!user.phone) missing.push('ফোন');
  if (!user.address) missing.push('ঠিকানা');
  if (!user.emergencyContact) missing.push('জরুরি যোগাযোগ (নাম)');
  if (!user.emergencyPhone) missing.push('জরুরি যোগাযোগ (ফোন)');
  
  if (!user.facebook && !user.instagram && !user.twitter && !user.linkedin) {
    missing.push('সোশ্যাল মিডিয়া প্রোফাইল (কমপক্ষে একটি)');
  }

  return missing;
}
