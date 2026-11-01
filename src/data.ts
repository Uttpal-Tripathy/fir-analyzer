import { DemoCase } from './types';

export const demoCases: DemoCase[] = [
  {
    label: "Assault / Home Invasion",
    rawText: "Reporting officer arrived at the 400 block of Main St, Bandra West. Victim stated that a known individual forced entry into the residence wielding a hammer. The victim is bleeding from a head laceration and is highly terrified. The suspect fled the scene before arrival in a silver sedan.",
    threatLevel: 'CRITICAL',
    confidenceScore: 95,
    investigativeSteps: ["Secure the crime scene", "Dispatch EMS for victim", "Issue BOLO for silver sedan", "Interview witnesses and canvas area"],
    expectedOutcomes: ["Felony assault charges", "Home invasion charges", "Potential arrest warrant for known suspect"],
    recommendedActs: ["Section 109 BNS (Attempt to murder)", "Section 329 BNS (Criminal trespass)", "Section 115 BNS (Voluntarily causing hurt)"],
    categoryScores: [
      { category: "Violence", score: 95 },
      { category: "Weapons", score: 85 },
      { category: "Medical", score: 90 },
      { category: "Theft", score: 10 },
      { category: "Substance", score: 5 }
    ],
    summary: "A known suspect forced entry with a hammer, causing a bleeding head laceration to the terrified victim before fleeing.",
    categories: ["Violence", "Weapons", "Medical Emergency"],
    stressWords: ["forced entry", "wielding a hammer", "bleeding", "head laceration", "highly terrified"],
    timeline: [
      { timestamp: "21:15 hrs", description: "Known suspect forced entry into residence wielding a hammer." },
      { timestamp: "21:18 hrs", description: "Suspect assaulted victim causing a bleeding head laceration and fled in a silver sedan." },
      { timestamp: "21:25 hrs", description: "Reporting officer arrived on scene and requested emergency medical response." }
    ],
    locationDetails: {
      state: "Maharashtra",
      district: "Mumbai Suburban",
      policeStation: "Bandra West Police Station",
      lat: 19.0596,
      lng: 72.8295
    }
  },
  {
    label: "Medical Emergency / Overdose",
    rawText: "Officers responded to a report of an unresponsive male in the alleyway behind 5th Ave, Koramangala. Subject was found not breathing. Administered Narcan and initiated CPR. Subject regained consciousness and was transported to Mercy Hospital.",
    threatLevel: 'CRITICAL',
    confidenceScore: 92,
    investigativeSteps: ["Follow up with Mercy Hospital", "Identify substance origin if possible", "Check for area surveillance cameras"],
    expectedOutcomes: ["Medical report filed", "Possible substance recovery", "Connecting with local outreach programs"],
    recommendedActs: ["Section 125 BNS (Act endangering life or personal safety of others)"],
    categoryScores: [
      { category: "Violence", score: 5 },
      { category: "Weapons", score: 0 },
      { category: "Medical", score: 98 },
      { category: "Theft", score: 0 },
      { category: "Substance", score: 92 }
    ],
    summary: "Officers found an unresponsive, non-breathing male and successfully revived him with CPR and Narcan before hospital transport.",
    categories: ["Medical Emergency", "Substance Abuse"],
    stressWords: ["unresponsive", "not breathing", "CPR", "Narcan"],
    timeline: [
      { timestamp: "01:10 hrs", description: "Patrol dispatched to alleyway regarding unresponsive male." },
      { timestamp: "01:16 hrs", description: "Officers administered Narcan and initiated CPR on non-breathing subject." },
      { timestamp: "01:28 hrs", description: "Subject regained consciousness and was transported to hospital." }
    ],
    locationDetails: {
      state: "Karnataka",
      district: "Bengaluru Urban",
      policeStation: "Koramangala Police Station",
      lat: 12.9352,
      lng: 77.6245
    }
  },
  {
    label: "Domestic Altercation",
    rawText: "Received a 112 call from a distressed individual in Banjara Hills stating their partner was intoxicated and throwing objects around the apartment. No weapons were mentioned, but the caller stated they feared for their immediate physical safety.",
    threatLevel: 'HIGH',
    confidenceScore: 88,
    investigativeSteps: ["Separate involved parties", "Assess for visible injuries", "Interview caller in private", "Check prior domestic incident history"],
    expectedOutcomes: ["Temporary protection order", "Misdemeanor domestic violence or property damage", "Mandatory cooling-off period"],
    recommendedActs: ["Section 85 BNS (Husband or relative of husband of a woman subjecting her to cruelty)", "Section 351 BNS (Criminal intimidation)"],
    categoryScores: [
      { category: "Violence", score: 75 },
      { category: "Domestic", score: 95 },
      { category: "Weapons", score: 10 },
      { category: "Medical", score: 15 },
      { category: "Substance", score: 60 }
    ],
    summary: "A distressed caller reported their intoxicated partner throwing objects, expressing immediate fear for their physical safety.",
    categories: ["Domestic", "Violence Potential", "Vulnerable Person"],
    stressWords: ["distressed", "intoxicated", "throwing objects", "feared", "immediate physical safety"],
    locationDetails: {
      state: "Telangana",
      district: "Hyderabad",
      policeStation: "Banjara Hills Police Station",
      lat: 17.4156,
      lng: 78.4347
    }
  },
  {
    label: "Public Disturbance / Noise",
    rawText: "Multiple units dispatched to 1200 block of Elm St, Anna Nagar regarding a noise complaint. Upon arrival, officers observed roughly 15 individuals having a party in the backyard. Music was turned down. No violence or injuries reported.",
    threatLevel: 'LOW',
    confidenceScore: 98,
    investigativeSteps: ["Issue verbal warning", "Log incident details", "Clear the scene"],
    expectedOutcomes: ["No further action unless recurring", "Potential noise ordinance citation on next visit"],
    categoryScores: [
      { category: "Violence", score: 0 },
      { category: "Disturbance", score: 95 },
      { category: "Weapons", score: 0 },
      { category: "Medical", score: 0 },
      { category: "Substance", score: 20 }
    ],
    summary: "Officers responded to a routine noise complaint involving a backyard party; the situation was resolved without incident or injury.",
    categories: ["Public Disturbance"],
    stressWords: [],
    locationDetails: {
      state: "Tamil Nadu",
      district: "Chennai",
      policeStation: "Anna Nagar Police Station",
      lat: 13.0850,
      lng: 80.2101
    }
  },
  {
    label: "Commercial Burglary",
    rawText: "Dispatch reported a triggered alarm at the Main Street Electronics store in Shivajinagar. Upon arrival, front glass door was found shattered. Multiple high-value electronic items missing from display cases. No suspects on scene.",
    threatLevel: 'HIGH',
    confidenceScore: 94,
    investigativeSteps: ["Secure premises", "Gather CCTV footage from store and neighboring businesses", "Process scene for fingerprints and DNA", "Inventory stolen items with owner"],
    expectedOutcomes: ["Burglary report filed", "Suspect identification via CCTV", "Entry into stolen property database"],
    recommendedActs: ["Section 305 BNS (Theft in a dwelling house or commercial premises)", "Section 331 BNS (Lurking house-trespass or house-breaking by night)"],
    categoryScores: [
      { category: "Theft", score: 98 },
      { category: "Property Damage", score: 85 },
      { category: "Violence", score: 10 },
      { category: "Commercial", score: 95 },
      { category: "Weapons", score: 5 }
    ],
    summary: "Commercial burglary with forced entry resulting in theft of high-value electronics.",
    categories: ["Burglary", "Property Damage", "Theft"],
    stressWords: ["triggered alarm", "shattered", "missing"],
    locationDetails: {
      state: "Maharashtra",
      district: "Pune",
      policeStation: "Shivajinagar Police Station",
      lat: 18.5314,
      lng: 73.8446
    }
  },
  {
    label: "Armed Robbery",
    rawText: "Suspect entered the highway fuel station in Gomti Nagar, brandished a handgun, and demanded cash from the register. Clerk handed over approximately Rs 35,000. Suspect fled on foot southbound. Clerk is uninjured but shaking.",
    threatLevel: 'CRITICAL',
    confidenceScore: 96,
    investigativeSteps: ["Set up perimeter", "Deploy K-9 unit for tracking", "Review store CCTV", "Interview clerk and any outside witnesses"],
    expectedOutcomes: ["Armed robbery charges", "BOLO for suspect description", "Weapons charges"],
    recommendedActs: ["Section 309 BNS (Robbery)", "Section 311 BNS (Robbery or dacoity with attempt to cause death or grievous hurt)", "Arms Act, 1959"],
    categoryScores: [
      { category: "Violence", score: 90 },
      { category: "Weapons", score: 98 },
      { category: "Theft", score: 85 },
      { category: "Commercial", score: 70 },
      { category: "Medical", score: 10 }
    ],
    summary: "An armed suspect robbed a fuel station clerk at gunpoint before fleeing on foot.",
    categories: ["Robbery", "Weapons", "Commercial Crime"],
    stressWords: ["handgun", "demanded cash", "fled on foot", "shaking"],
    locationDetails: {
      state: "Uttar Pradesh",
      district: "Lucknow",
      policeStation: "Gomti Nagar Police Station",
      lat: 26.8467,
      lng: 80.9462
    }
  },
  {
    label: "Vehicle Theft",
    rawText: "Victim reported their Mahindra Scorpio SUV stolen from their driveway in Malviya Nagar overnight. Vehicle was locked, but a spare key might have been inside. No broken glass found at the scene.",
    threatLevel: 'MEDIUM',
    confidenceScore: 89,
    investigativeSteps: ["Enter VIN into Vahan stolen vehicle database", "Check neighborhood CCTV cameras", "Alert patrol units with vehicle description and plates"],
    expectedOutcomes: ["Vehicle theft report filed", "Possible recovery of vehicle abandoned or used in another crime"],
    recommendedActs: ["Section 303(2) BNS (Theft of vehicle)"],
    categoryScores: [
      { category: "Theft", score: 95 },
      { category: "Vehicle", score: 100 },
      { category: "Property Damage", score: 10 },
      { category: "Violence", score: 0 },
      { category: "Residential", score: 60 }
    ],
    summary: "An SUV was reported stolen from a residential driveway overnight without signs of forced entry.",
    categories: ["Grand Theft Auto", "Property Crime"],
    stressWords: ["stolen"],
    locationDetails: {
      state: "Rajasthan",
      district: "Jaipur",
      policeStation: "Malviya Nagar Police Station",
      lat: 26.8549,
      lng: 75.8243
    }
  },
  {
    label: "Kidnapping / Missing Person",
    rawText: "Frantic caller states their 6-year-old child disappeared from the Navrangpura park playground 15 minutes ago. Witnesses reported seeing a man in a blue jacket leading the child towards a parking lot.",
    threatLevel: 'CRITICAL',
    confidenceScore: 91,
    investigativeSteps: ["Issue Amber/Missing Child Alert immediately", "Lock down park exits", "Dispatch all available units to canvas area", "Interview witnesses thoroughly to get suspect composite"],
    expectedOutcomes: ["Widespread search initiated", "Abduction investigation launched", "Involvement of state crime branch if needed"],
    recommendedActs: ["Section 137 BNS (Kidnapping)", "Section 140 BNS (Kidnapping or abducting in order to murder or for ransom)"],
    categoryScores: [
      { category: "Kidnapping", score: 98 },
      { category: "Vulnerable Person", score: 95 },
      { category: "Violence", score: 60 },
      { category: "Public Area", score: 80 },
      { category: "Urgent", score: 100 }
    ],
    summary: "A 6-year-old child went missing from a park, with witnesses reporting suspicious abduction activity.",
    categories: ["Kidnapping", "Missing Child", "High Priority"],
    stressWords: ["frantic", "disappeared", "leading the child"],
    locationDetails: {
      state: "Gujarat",
      district: "Ahmedabad",
      policeStation: "Navrangpura Police Station",
      lat: 23.0365,
      lng: 72.5611
    }
  },
  {
    label: "Cybercrime / Fraud",
    rawText: "Elderly victim in Kankarbagh scammed out of Rs 1,25,000 via a telephone call from someone claiming to be their grandson needing urgent legal bail money. Bank transfer was completed before the victim verified the story.",
    threatLevel: 'MEDIUM',
    confidenceScore: 93,
    investigativeSteps: ["Contact victim's bank and cyber cell immediately to attempt transaction freeze", "Gather caller ID and phone records", "Forward case to cybercrime task force"],
    expectedOutcomes: ["Fraud report filed", "Potential recovery of funds", "Investigation of destination account"],
    recommendedActs: ["Section 318 BNS (Cheating)", "Section 319 BNS (Cheating by personation)", "Section 66D IT Act"],
    categoryScores: [
      { category: "Fraud", score: 98 },
      { category: "Vulnerable Person", score: 90 },
      { category: "Cybercrime", score: 85 },
      { category: "Theft", score: 80 },
      { category: "Violence", score: 0 }
    ],
    summary: "Elderly victim lost Rs 1,25,000 in a telephone impersonation scam.",
    categories: ["Fraud", "Elder Abuse", "Financial Crime"],
    stressWords: ["scammed", "bail money", "transfer"],
    locationDetails: {
      state: "Bihar",
      district: "Patna",
      policeStation: "Kankarbagh Police Station",
      lat: 25.5941,
      lng: 85.1376
    }
  },
  {
    label: "Vandalism / Property Damage",
    rawText: "Several cars along the 900 block of MP Nagar had their tires slashed and side mirrors broken overnight. Total of 6 vehicles affected. Unknown perpetrators.",
    threatLevel: 'LOW',
    confidenceScore: 88,
    investigativeSteps: ["Document damage to all vehicles", "Canvas street for security cameras", "Increase night patrols in the area"],
    expectedOutcomes: ["Multiple property damage reports filed", "Identification of suspect(s) if caught on camera"],
    recommendedActs: ["Section 324 BNS (Mischief causing damage to property)"],
    categoryScores: [
      { category: "Property Damage", score: 95 },
      { category: "Vehicle", score: 80 },
      { category: "Violence", score: 10 },
      { category: "Disturbance", score: 40 },
      { category: "Theft", score: 0 }
    ],
    summary: "Overnight vandalism involving slashed tires and broken mirrors on six parked vehicles.",
    categories: ["Vandalism", "Property Damage"],
    stressWords: ["tires slashed", "broken"],
    locationDetails: {
      state: "Madhya Pradesh",
      district: "Bhopal",
      policeStation: "MP Nagar Police Station",
      lat: 23.2332,
      lng: 77.4343
    }
  },
  {
    label: "Arson",
    rawText: "Fire department requested police assistance at an abandoned industrial godown fire in Sitabuldi. Fire marshal indicates preliminary evidence of accelerants. Several youths were seen running from the alley right before the blaze started.",
    threatLevel: 'HIGH',
    confidenceScore: 90,
    investigativeSteps: ["Establish secure perimeter with Fire Brigade", "Locate and interview witnesses regarding the fleeing youths", "Assist forensic investigators with evidence collection", "Check nearby camera feeds"],
    expectedOutcomes: ["Arson investigation opened", "Identification of suspects", "Mischief by fire charges"],
    recommendedActs: ["Section 326 BNS (Mischief by fire or explosive substance with intent to destroy building)"],
    categoryScores: [
      { category: "Arson", score: 98 },
      { category: "Property Damage", score: 95 },
      { category: "Violence", score: 30 },
      { category: "Commercial", score: 70 },
      { category: "Public Safety", score: 85 }
    ],
    summary: "Suspicious fire at an abandoned warehouse with evidence of accelerants and suspects fleeing the scene.",
    categories: ["Arson", "Property Crime", "Suspicious Activity"],
    stressWords: ["fire", "accelerants", "blaze", "running"],
    locationDetails: {
      state: "Maharashtra",
      district: "Nagpur",
      policeStation: "Sitabuldi Police Station",
      lat: 21.1458,
      lng: 79.0882
    }
  },
  {
    label: "Homicide Investigation",
    rawText: "Patrol responded to shots fired in Sector 17. An adult male was found deceased with multiple gunshot wounds in the parking lot of a local bar. No weapons found at the scene. Patrons are panicked and scattering.",
    threatLevel: 'CRITICAL',
    confidenceScore: 97,
    investigativeSteps: ["Secure entire parking lot and bar immediately", "Detain all available witnesses for questioning", "Call in homicide detectives and forensic crime scene unit", "Review bar security cameras"],
    expectedOutcomes: ["Homicide investigation initiated", "Post-mortem ordered", "Search warrants for suspect communication and addresses once identified"],
    recommendedActs: ["Section 103 BNS (Punishment for murder)", "Section 25/27 Arms Act"],
    categoryScores: [
      { category: "Violence", score: 100 },
      { category: "Weapons", score: 98 },
      { category: "Homicide", score: 100 },
      { category: "Disturbance", score: 80 },
      { category: "Medical", score: 0 }
    ],
    summary: "Fatal shooting of an adult male in a bar parking lot, sparking mass panic among patrons.",
    categories: ["Homicide", "Weapons", "Violent Crime"],
    stressWords: ["shots fired", "deceased", "multiple gunshot wounds", "panicked", "scattering"],
    locationDetails: {
      state: "Chandigarh",
      district: "Chandigarh",
      policeStation: "Sector 17 Police Station",
      lat: 30.7415,
      lng: 76.7821
    }
  },
  {
    label: "Human Trafficking",
    rawText: "Routine checkpost stop of a white cargo van near Paltan Bazaar revealed 12 individuals locked in the cargo area without ventilation or water. Driver has a history of trafficking and is uncooperative.",
    threatLevel: 'CRITICAL',
    confidenceScore: 94,
    investigativeSteps: ["Call EMS to evaluate passengers immediately", "Arrest and interrogate driver", "Contact Anti-Human Trafficking Unit (AHTU)", "Provide victims with emergency assistance and rehabilitation"],
    expectedOutcomes: ["Human trafficking charges under BNS", "Vehicle impound and seizure", "Victim rescue and protection"],
    recommendedActs: ["Section 143 BNS (Trafficking of person)", "Section 127 BNS (Wrongful confinement)"],
    categoryScores: [
      { category: "Trafficking", score: 100 },
      { category: "Vulnerable Person", score: 95 },
      { category: "Vehicle", score: 70 },
      { category: "Violence", score: 50 },
      { category: "Medical", score: 80 }
    ],
    summary: "Discovery of 12 individuals locked in a van without ventilation during a traffic stop, driver arrested.",
    categories: ["Human Trafficking", "Smuggling", "Medical Emergency"],
    stressWords: ["locked", "without ventilation", "uncooperative"],
    locationDetails: {
      state: "Assam",
      district: "Kamrup Metropolitan",
      policeStation: "Paltan Bazaar Police Station, Guwahati",
      lat: 26.1796,
      lng: 91.7519
    }
  },
  {
    label: "Hit and Run",
    rawText: "Pedestrian struck by a speeding black SUV in the crosswalk at Marine Drive, Ernakulam. Vehicle did not stop. Pedestrian suffered broken limbs and is unconscious. Bystanders provided partial license plate.",
    threatLevel: 'HIGH',
    confidenceScore: 93,
    investigativeSteps: ["Render first aid until EMS arrives", "Broadcast BOLO for black SUV with partial plate", "Document skid marks and collect vehicle debris", "Interview witnesses on scene"],
    expectedOutcomes: ["Hit and run charges under BNS", "Rash driving resulting in grievous injury", "Vehicle identification through ANPR cameras"],
    recommendedActs: ["Section 106(2) BNS (Hit and run / rash and negligent driving)", "Section 281 BNS (Rash driving on a public way)"],
    categoryScores: [
      { category: "Vehicle", score: 95 },
      { category: "Violence", score: 60 },
      { category: "Medical", score: 95 },
      { category: "Property Damage", score: 20 },
      { category: "Public Area", score: 85 }
    ],
    summary: "A pedestrian was severely injured in a crosswalk by a speeding black SUV that fled the scene.",
    categories: ["Traffic Collision", "Hit and Run", "Medical Emergency"],
    stressWords: ["struck", "speeding", "unconscious", "did not stop"],
    locationDetails: {
      state: "Kerala",
      district: "Ernakulam",
      policeStation: "Ernakulam Central Police Station, Kochi",
      lat: 9.9816,
      lng: 76.2999
    }
  },
  {
    label: "Drug Trafficking",
    rawText: "Execution of a search warrant at MVP Colony resulted in the seizure of 5 kilos of suspected synthetic narcotics, Rs 18,00,000 in cash, and three illegal firearms. Two occupants arrested without incident.",
    threatLevel: 'HIGH',
    confidenceScore: 95,
    investigativeSteps: ["Properly secure and seal narcotics for FSL testing", "Process firearms for ballistics and fingerprints", "Seize and detail cash for asset attachment", "Interrogate suspects to identify distribution networks"],
    expectedOutcomes: ["NDPS Act & BNS organized crime charges", "Illegal weapons possession charges", "Asset forfeiture proceedings"],
    recommendedActs: ["Section 111 BNS (Organized crime)", "NDPS Act Sections 21/22", "Arms Act Section 25"],
    categoryScores: [
      { category: "Substance", score: 100 },
      { category: "Weapons", score: 90 },
      { category: "Theft", score: 0 },
      { category: "Violence", score: 20 },
      { category: "Residential", score: 80 }
    ],
    summary: "Search warrant execution yielded significant quantities of synthetic narcotics, cash, and illegal firearms, with two arrests.",
    categories: ["Drug Trafficking", "Weapons", "Search Warrant"],
    stressWords: ["seizure", "narcotics", "illegal firearms", "arrested"],
    locationDetails: {
      state: "Andhra Pradesh",
      district: "Visakhapatnam",
      policeStation: "MVP Colony Police Station",
      lat: 17.7384,
      lng: 83.3401
    }
  },
  {
    label: "Public Intoxication / Indecent Exposure",
    rawText: "Officers approached a severely intoxicated male causing public nuisance outside a restaurant in Vijay Nagar in broad daylight. Subject became belligerent and obstructed officers on duty, requiring two officers to secure.",
    threatLevel: 'LOW',
    confidenceScore: 92,
    investigativeSteps: ["Secure subject in patrol vehicle", "Obtain statements from restaurant staff and patrons", "Conduct medical examination before booking"],
    expectedOutcomes: ["Public nuisance charges", "Obstruction of public servant charges"],
    recommendedActs: ["Section 355 BNS (Misconduct in public by a drunken person)", "Section 221 BNS (Obstructing public servant in discharge of public functions)"],
    categoryScores: [
      { category: "Substance", score: 85 },
      { category: "Disturbance", score: 90 },
      { category: "Violence", score: 30 },
      { category: "Public Area", score: 95 },
      { category: "Medical", score: 10 }
    ],
    summary: "Severely intoxicated male arrested for public misconduct and obstructing officers outside a restaurant.",
    categories: ["Public Order", "Substance Abuse", "Resisting Arrest"],
    stressWords: ["intoxicated", "belligerent", "obstructed"],
    locationDetails: {
      state: "Madhya Pradesh",
      district: "Indore",
      policeStation: "Vijay Nagar Police Station",
      lat: 22.7533,
      lng: 75.8937
    }
  },
  {
    label: "Mumbai - Extortion / Threat",
    rawText: "Complainant, a local shop owner in Andheri East, reports receiving multiple threat calls from an unknown number demanding Rs 5,000,000 as 'protection money'. The caller threatened to burn down the shop and physically harm the complainant's family if the demand is not met. Two unidentified men on a motorcycle also visited the shop yesterday and brandished a country-made pistol as a warning.",
    threatLevel: 'HIGH',
    confidenceScore: 92,
    investigativeSteps: ["Trace caller ID and analyze call data records (CDR)", "Retrieve CCTV footage from the shop and nearby areas", "Provide police protection to the complainant's family", "Alert Anti-Extortion Cell"],
    expectedOutcomes: ["Extortion charges filed", "Identification of motorcycle license plate", "Possible gang affiliation link"],
    recommendedActs: ["Section 308 BNS (Extortion by putting a person in fear of death or grievous hurt)", "Section 351 BNS (Criminal intimidation)", "Arms Act, 1959"],
    categoryScores: [
      { category: "Violence", score: 85 },
      { category: "Weapons", score: 90 },
      { category: "Fraud", score: 0 },
      { category: "Theft", score: 80 },
      { category: "Commercial", score: 90 }
    ],
    summary: "A shop owner in Mumbai received extortion calls and was threatened with a firearm by two unidentified men on a motorcycle.",
    categories: ["Extortion", "Weapons", "Organized Crime"],
    stressWords: ["threat calls", "demanding", "burn down", "physically harm", "brandished", "pistol"],
    timeline: [
      { timestamp: "Day 1 - 14:30 hrs", description: "Complainant received multiple threat calls demanding Rs 50,00,000 protection money." },
      { timestamp: "Day 2 - 19:15 hrs", description: "Two unidentified men on a motorcycle visited the shop and brandished a country-made pistol." },
      { timestamp: "Day 3 - 10:00 hrs", description: "Complainant lodged formal FIR at Andheri East Police Station." }
    ],
    locationDetails: {
      state: "Maharashtra",
      district: "Mumbai Suburban",
      policeStation: "Andheri East Police Station",
      lat: 19.1136,
      lng: 72.8697
    }
  },
  {
    label: "Jamtara - Cyber / UPI Fraud",
    rawText: "The victim, a retired teacher, reported losing Rs 1,50,000 from their bank account. They received a call from someone claiming to be a bank official stating their KYC was pending and their account would be blocked. The victim was tricked into installing a screen-sharing app and sharing an OTP, after which multiple unauthorized UPI transactions were executed.",
    threatLevel: 'MEDIUM',
    confidenceScore: 96,
    investigativeSteps: ["Immediately freeze the destination bank accounts", "Contact NPCI and bank nodal officers for transaction reversal", "Trace IP address and phone number details of the scammer", "Report to National Cyber Crime Reporting Portal"],
    expectedOutcomes: ["Cyber fraud case registered", "Potential partial recovery of funds", "Identification of mule accounts"],
    recommendedActs: ["Section 318 BNS (Cheating and dishonestly inducing delivery of property)", "Section 319 BNS (Cheating by personation)", "Section 66D IT Act"],
    categoryScores: [
      { category: "Fraud", score: 98 },
      { category: "Cybercrime", score: 100 },
      { category: "Vulnerable Person", score: 90 },
      { category: "Violence", score: 0 },
      { category: "Substance", score: 0 }
    ],
    summary: "A retired teacher was defrauded of Rs 1,50,000 through a KYC update scam involving a screen-sharing app and unauthorized UPI transfers.",
    categories: ["Cyber Fraud", "UPI Scam", "Cheating"],
    stressWords: ["losing", "blocked", "tricked", "unauthorized"],
    timeline: [
      { timestamp: "11:05 hrs", description: "Victim received fraudulent KYC verification call from person impersonating bank official." },
      { timestamp: "11:18 hrs", description: "Victim installed remote screen-sharing application and shared OTP." },
      { timestamp: "11:22 hrs", description: "Multiple unauthorized UPI transactions totaling Rs 1,50,000 debited." }
    ],
    locationDetails: {
      state: "Jharkhand",
      district: "Jamtara",
      policeStation: "Jamtara Cyber Crime Police Station",
      lat: 23.9629,
      lng: 86.8026
    }
  },
  {
    label: "Delhi - Road Rage / Assault",
    rawText: "At the Outer Ring Road intersection, a minor collision occurred between a Swift Dzire and an SUV. The occupants of the SUV stepped out, dragged the driver of the Dzire out of his vehicle, and brutally assaulted him with iron rods. The victim sustained severe head injuries and fractures. Bystanders recorded the incident on their phones. Suspects fled the scene.",
    threatLevel: 'CRITICAL',
    confidenceScore: 94,
    investigativeSteps: ["Transport victim to AIIMS Trauma Centre immediately", "Collect video footage from bystanders and traffic cameras", "Identify the SUV registration number", "Issue BOLO for the SUV and suspects"],
    expectedOutcomes: ["Attempt to murder and grievous hurt charges", "Arrest of suspects based on video evidence", "Vehicle impoundment"],
    recommendedActs: ["Section 109 BNS (Attempt to murder)", "Section 117 BNS (Voluntarily causing grievous hurt)", "Section 351 BNS (Criminal intimidation)"],
    categoryScores: [
      { category: "Violence", score: 100 },
      { category: "Weapons", score: 95 },
      { category: "Medical", score: 98 },
      { category: "Vehicle", score: 90 },
      { category: "Public Area", score: 95 }
    ],
    summary: "A minor traffic collision escalated into a brutal road rage assault with iron rods, leaving the victim with severe head injuries.",
    categories: ["Road Rage", "Assault", "Medical Emergency"],
    stressWords: ["dragged", "brutally assaulted", "iron rods", "severe head injuries", "fractures"],
    timeline: [
      { timestamp: "22:40 hrs", description: "Minor collision occurred between Swift Dzire and SUV at Outer Ring Road intersection." },
      { timestamp: "22:43 hrs", description: "SUV occupants dragged victim out and assaulted him with iron rods." },
      { timestamp: "22:50 hrs", description: "Suspects fled scene; PCR van arrived and rushed victim to AIIMS Trauma Centre." }
    ],
    locationDetails: {
      state: "Delhi",
      district: "South Delhi",
      policeStation: "Hauz Khas Police Station",
      lat: 28.5494,
      lng: 77.2001
    }
  },
  {
    label: "Kolkata - Molestation Case",
    rawText: "The complainant, a 24-year-old woman, stated that while returning from work on a crowded local train at around 8:30 PM, a man forcefully grabbed her and engaged in inappropriate physical contact. When she raised an alarm, the accused threatened her with dire consequences before escaping at the next station. Several co-passengers witnessed the event but failed to intervene in time.",
    threatLevel: 'HIGH',
    confidenceScore: 95,
    investigativeSteps: ["Record victim's statement under Section 183 of BNSS", "Secure CCTV footage from the train compartments and the station of incident", "Identify eyewitnesses from daily commuters", "Alert Government Railway Police (GRP) network"],
    expectedOutcomes: ["Accused apprehended through CCTV and witness sketches", "Fast-track legal proceedings due to gravity", "Victim provided counseling and safety measures"],
    recommendedActs: ["Section 74 BNS (Assault or use of criminal force to woman with intent to outrage her modesty)", "Section 351(2) BNS (Criminal intimidation)", "Section 75 BNS (Sexual harassment)"],
    categoryScores: [
      { category: "Violence", score: 80 },
      { category: "Weapons", score: 0 },
      { category: "Medical", score: 20 },
      { category: "Public Area", score: 100 },
      { category: "Vulnerable Person", score: 95 }
    ],
    summary: "A young woman was molested and threatened by an unidentified man on a crowded local train during her evening commute.",
    categories: ["Molestation", "Harassment", "Public Transport"],
    stressWords: ["forcefully grabbed", "inappropriate physical contact", "threatened", "dire consequences", "escaping"],
    timeline: [
      { timestamp: "20:30 hrs", description: "Accused forcefully grabbed complainant inside crowded suburban train compartment." },
      { timestamp: "20:34 hrs", description: "Complainant raised alarm; accused threatened her with dire consequences." },
      { timestamp: "20:38 hrs", description: "Accused alighted and fled as train pulled into Sealdah station." }
    ],
    locationDetails: {
      state: "West Bengal",
      district: "Kolkata",
      policeStation: "Sealdah GRP Police Station",
      lat: 22.5676,
      lng: 88.3700
    }
  }
];
