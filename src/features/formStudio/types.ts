export type Gender =
  | "Female"
  | "Male"
  | "Non-binary"
  | "Prefer not to say";

export type ContactMethod = "Email" | "Phone" | "SMS";

export interface FormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number | "";
  gender: Gender | "";

  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  postalCode: string;
  preferredContact: ContactMethod;

  interests: string[];
  newsletter: boolean;

  occupation: string;
  bio: string;
  password: string;
  confirmPassword: string;
}

export const defaultFormValues: FormValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  age: "",
  gender: "",

  email: "",
  phone: "",
  website: "",
  address: "",
  city: "",
  postalCode: "",
  preferredContact: "Email",

  interests: [],
  newsletter: false,

  occupation: "",
  bio: "",
  password: "",
  confirmPassword: "",
};

export const interestOptions = [
  "Technology",
  "Design",
  "Business",
  "Sports",
  "Travel",
  "Music",
];

export const steps = [
  {
    title: "Personal Details",
    description: "Tell us a little about yourself.",
  },
  {
    title: "Contact Details",
    description: "How can we reach you?",
  },
  {
    title: "Preferences",
    description: "Choose your preferences.",
  },
  {
    title: "Additional Information",
    description: "Share some additional details.",
  },
  {
    title: "Review",
    description: "Review your information before submitting.",
  },
];