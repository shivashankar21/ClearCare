
import { DermatologistInfo } from '../constants/types';

// Mock ZIP code to coordinates mapping (major US cities + ZIP 20148)
const ZIP_COORDINATES: { [key: string]: { lat: number; lng: number; city: string } } = {
  '20148': { lat: 39.0458, lng: -77.5378, city: 'Ashburn, VA' },
  '10001': { lat: 40.7505, lng: -73.9934, city: 'New York, NY' },
  '90210': { lat: 34.0901, lng: -118.4065, city: 'Beverly Hills, CA' },
  '60601': { lat: 41.8825, lng: -87.6441, city: 'Chicago, IL' },
  '33101': { lat: 25.7617, lng: -80.1918, city: 'Miami, FL' },
  '75201': { lat: 32.7767, lng: -96.7970, city: 'Dallas, TX' },
  '02101': { lat: 42.3601, lng: -71.0589, city: 'Boston, MA' },
  '98101': { lat: 47.6062, lng: -122.3321, city: 'Seattle, WA' },
  '85001': { lat: 33.4484, lng: -112.0740, city: 'Phoenix, AZ' },
  '19101': { lat: 39.9526, lng: -75.1652, city: 'Philadelphia, PA' },
  '30301': { lat: 33.7490, lng: -84.3880, city: 'Atlanta, GA' }
};

export class DermatologistService {
  private static dermatologists: DermatologistInfo[] = [
    // Ashburn, VA area (ZIP 20148)
    {
      id: 'va-1',
      name: 'Dr. Rebecca Thompson',
      specialty: 'General Dermatology, Cosmetic Dermatology',
      address: '44025 Pipeline Plaza, Suite 300',
      city: 'Ashburn',
      state: 'VA',
      zipCode: '20148',
      phone: '(571) 555-0101',
      rating: 4.9,
      reviewCount: 142,
      acceptingPatients: true,
      latitude: 39.0458,
      longitude: -77.5378,
      education: 'George Washington University Medical School',
      yearsExperience: 16,
      website: 'www.ashburnskincare.com'
    },
    {
      id: 'va-2',
      name: 'Dr. Mark Stevens',
      specialty: 'Mohs Surgery, Skin Cancer Treatment',
      address: '20440 Exchange Street, Suite 200',
      city: 'Ashburn',
      state: 'VA',
      zipCode: '20148',
      phone: '(571) 555-0202',
      rating: 4.8,
      reviewCount: 98,
      acceptingPatients: true,
      latitude: 39.0425,
      longitude: -77.4892,
      education: 'University of Virginia Medical School',
      yearsExperience: 18,
      website: 'www.novamohs.com'
    },
    {
      id: 'va-3',
      name: 'Dr. Lisa Patel',
      specialty: 'Pediatric Dermatology, Eczema Specialist',
      address: '43330 Junction Plaza, Suite 150',
      city: 'Ashburn',
      state: 'VA',
      zipCode: '20147',
      phone: '(703) 555-0303',
      rating: 4.7,
      reviewCount: 187,
      acceptingPatients: true,
      latitude: 39.0156,
      longitude: -77.4875,
      education: 'Johns Hopkins Medical School',
      yearsExperience: 12,
      website: 'www.kidsskinva.com'
    },
    {
      id: 'dc-1',
      name: 'Dr. Patricia Williams',
      specialty: 'Dermatopathology, Melanoma Specialist',
      address: '2021 K Street NW, Suite 500',
      city: 'Washington',
      state: 'DC',
      zipCode: '20006',
      phone: '(202) 555-0404',
      rating: 4.9,
      reviewCount: 76,
      acceptingPatients: false,
      latitude: 38.9022,
      longitude: -77.0454,
      education: 'Harvard Medical School',
      yearsExperience: 22,
      website: 'www.dcdermpathology.com'
    },
    {
      id: 'va-4',
      name: 'Dr. Kevin Chen',
      specialty: 'Cosmetic Dermatology, Anti-Aging',
      address: '1860 Town Center Dr, Suite 250',
      city: 'Reston',
      state: 'VA',
      zipCode: '20190',
      phone: '(703) 555-0505',
      rating: 4.6,
      reviewCount: 203,
      acceptingPatients: true,
      latitude: 38.9586,
      longitude: -77.3570,
      education: 'Georgetown University Medical School',
      yearsExperience: 14,
      website: 'www.restonbeautyskin.com'
    },
    {
      id: 'md-1',
      name: 'Dr. Sarah Montgomery',
      specialty: 'General Dermatology, Psoriasis Treatment',
      address: '15245 Shady Grove Rd, Suite 400',
      city: 'Rockville',
      state: 'MD',
      zipCode: '20850',
      phone: '(301) 555-0606',
      rating: 4.5,
      reviewCount: 134,
      acceptingPatients: true,
      latitude: 39.0840,
      longitude: -77.1528,
      education: 'University of Maryland Medical School',
      yearsExperience: 13,
      website: 'www.rockvilleskin.com'
    },
    {
      id: 'va-5',
      name: 'Dr. James Rodriguez',
      specialty: 'Dermatologic Surgery, Reconstruction',
      address: '8505 Arlington Blvd, Suite 300',
      city: 'Fairfax',
      state: 'VA',
      zipCode: '22031',
      phone: '(703) 555-0707',
      rating: 4.8,
      reviewCount: 89,
      acceptingPatients: true,
      latitude: 38.8732,
      longitude: -77.2497,
      education: 'Virginia Commonwealth University',
      yearsExperience: 19,
      website: 'www.fairfaxdermsurgery.com'
    },
    {
      id: 'va-6',
      name: 'Dr. Michelle Kim',
      specialty: 'Acne Treatment, Hormonal Dermatology',
      address: '2311 M Street NW, Suite 600',
      city: 'Washington',
      state: 'DC',
      zipCode: '20037',
      phone: '(202) 555-0808',
      rating: 4.7,
      reviewCount: 156,
      acceptingPatients: true,
      latitude: 38.9057,
      longitude: -77.0519,
      education: 'George Washington University Medical School',
      yearsExperience: 10,
      website: 'www.dcacnespecialist.com'
    },
    {
      id: 'va-7',
      name: 'Dr. Robert Taylor',
      specialty: 'Laser Dermatology, Scar Treatment',
      address: '21785 Filigree Court, Suite 105',
      city: 'Ashburn',
      state: 'VA',
      zipCode: '20147',
      phone: '(571) 555-0909',
      rating: 4.6,
      reviewCount: 112,
      acceptingPatients: true,
      latitude: 39.0244,
      longitude: -77.4656,
      education: 'Duke University Medical School',
      yearsExperience: 15,
      website: 'www.laserdermatologyva.com'
    },
    {
      id: 'md-2',
      name: 'Dr. Angela Foster',
      specialty: 'Dermatology, Allergy & Immunology',
      address: '19735 Germantown Rd, Suite 250',
      city: 'Germantown',
      state: 'MD',
      zipCode: '20874',
      phone: '(240) 555-1010',
      rating: 4.4,
      reviewCount: 167,
      acceptingPatients: false,
      latitude: 39.1732,
      longitude: -77.2717,
      education: 'Johns Hopkins Medical School',
      yearsExperience: 17,
      website: 'www.allergydermatologymd.com'
    },
    // New York area
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'General Dermatology, Cosmetic Dermatology',
      address: '123 Park Avenue, Suite 456',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '(212) 555-0123',
      rating: 4.8,
      reviewCount: 127,
      acceptingPatients: true,
      latitude: 40.7589,
      longitude: -73.9851,
      education: 'Harvard Medical School',
      yearsExperience: 15,
      website: 'www.drjohnsondermatology.com'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Mohs Surgery, Skin Cancer',
      address: '456 Madison Avenue, Floor 8',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '(212) 555-0456',
      rating: 4.9,
      reviewCount: 89,
      acceptingPatients: true,
      latitude: 40.7614,
      longitude: -73.9776,
      education: 'Johns Hopkins Medical School',
      yearsExperience: 12,
      website: 'www.mohsnyc.com'
    },
    // Beverly Hills area
    {
      id: '3',
      name: 'Dr. Emma Rodriguez',
      specialty: 'Cosmetic Dermatology, Anti-Aging',
      address: '789 Rodeo Drive, Suite 200',
      city: 'Beverly Hills',
      state: 'CA',
      zipCode: '90210',
      phone: '(310) 555-0789',
      rating: 4.7,
      reviewCount: 203,
      acceptingPatients: false,
      latitude: 34.0677,
      longitude: -118.4000,
      education: 'UCLA Medical School',
      yearsExperience: 18,
      website: 'www.beverlyhillsskin.com'
    },
    {
      id: '4',
      name: 'Dr. David Kim',
      specialty: 'Pediatric Dermatology, Eczema',
      address: '321 Wilshire Blvd, Suite 150',
      city: 'Beverly Hills',
      state: 'CA',
      zipCode: '90210',
      phone: '(310) 555-0321',
      rating: 4.6,
      reviewCount: 156,
      acceptingPatients: true,
      latitude: 34.0619,
      longitude: -118.4016,
      education: 'Stanford Medical School',
      yearsExperience: 10,
      website: 'www.kidsskincare.com'
    },
    // Chicago area
    {
      id: '5',
      name: 'Dr. Jennifer Williams',
      specialty: 'General Dermatology, Psoriasis',
      address: '555 Michigan Avenue, Suite 300',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      phone: '(312) 555-0555',
      rating: 4.5,
      reviewCount: 92,
      acceptingPatients: true,
      latitude: 41.8902,
      longitude: -87.6250,
      education: 'Northwestern Medical School',
      yearsExperience: 14,
      website: 'www.chicagoskincare.com'
    },
    {
      id: '6',
      name: 'Dr. Robert Taylor',
      specialty: 'Dermatopathology, Skin Cancer',
      address: '888 Lake Shore Drive, Suite 500',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      phone: '(312) 555-0888',
      rating: 4.9,
      reviewCount: 67,
      acceptingPatients: true,
      latitude: 41.8781,
      longitude: -87.6298,
      education: 'University of Chicago Medical School',
      yearsExperience: 20,
      website: 'www.skinpathology.com'
    },
    // Miami area
    {
      id: '7',
      name: 'Dr. Maria Gonzalez',
      specialty: 'Cosmetic Dermatology, Laser Treatments',
      address: '1200 Biscayne Blvd, Suite 700',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      phone: '(305) 555-1200',
      rating: 4.8,
      reviewCount: 178,
      acceptingPatients: true,
      latitude: 25.7867,
      longitude: -80.1864,
      education: 'University of Miami Medical School',
      yearsExperience: 16,
      website: 'www.miamibeautyskin.com'
    },
    {
      id: '8',
      name: 'Dr. Carlos Mendoza',
      specialty: 'General Dermatology, Acne Treatment',
      address: '456 Collins Avenue, Suite 250',
      city: 'Miami Beach',
      state: 'FL',
      zipCode: '33101',
      phone: '(305) 555-0456',
      rating: 4.4,
      reviewCount: 134,
      acceptingPatients: true,
      latitude: 25.7907,
      longitude: -80.1300,
      education: 'Florida International University',
      yearsExperience: 8,
      website: 'www.beachdermatology.com'
    },
    // Dallas area
    {
      id: '9',
      name: 'Dr. Amanda White',
      specialty: 'Pediatric Dermatology, Birthmarks',
      address: '777 Main Street, Suite 400',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      phone: '(214) 555-0777',
      rating: 4.7,
      reviewCount: 95,
      acceptingPatients: false,
      latitude: 32.7801,
      longitude: -96.8067,
      education: 'University of Texas Southwestern',
      yearsExperience: 13,
      website: 'www.dallaschildskin.com'
    },
    {
      id: '10',
      name: 'Dr. James Brown',
      specialty: 'Mohs Surgery, Reconstructive Surgery',
      address: '999 Commerce Street, Suite 600',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      phone: '(214) 555-0999',
      rating: 4.9,
      reviewCount: 73,
      acceptingPatients: true,
      latitude: 32.7787,
      longitude: -96.7981,
      education: 'Baylor College of Medicine',
      yearsExperience: 22,
      website: 'www.texasmohssurgery.com'
    }
  ];

  static async findDermatologists(zipCode: string): Promise<DermatologistInfo[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const coordinates = ZIP_COORDINATES[zipCode];
    if (!coordinates) {
      throw new Error('ZIP code not found. Please enter a valid ZIP code.');
    }

    // Filter dermatologists within 50 miles and calculate distances
    const nearby = this.dermatologists
      .map(doc => ({
        ...doc,
        distance: this.calculateDistance(
          coordinates.lat,
          coordinates.lng,
          doc.latitude,
          doc.longitude
        )
      }))
      .filter(doc => doc.distance <= 50)
      .sort((a, b) => a.distance - b.distance);

    return nearby;
  }

  static getDermatologistById(id: string): DermatologistInfo | null {
    return this.dermatologists.find(doc => doc.id === id) || null;
  }

  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal place
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static getSupportedZipCodes(): string[] {
    return Object.keys(ZIP_COORDINATES);
  }

  static getCityByZipCode(zipCode: string): string | null {
    return ZIP_COORDINATES[zipCode]?.city || null;
  }
}
