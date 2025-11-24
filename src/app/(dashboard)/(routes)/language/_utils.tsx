import { Icons } from "./_icons";

export const getCardIcon = (topic: string) => {
  switch (topic) {
    case "Animals and Nature":
      return "🐶";
    case "Body Parts":
      return "👃";
    case "Everyday Objects":
      return "🛍️";
    case "Family Members":
      return "👪";
    case "Food and Drinks":
      return Icons.burger;
    case "Colors and Shapes":
      return "🌈";
    case "Greetings and Introductions":
      return Icons.greetings;
    case "School and Classroom":
      return Icons.school;
    case "Numbers and Time":
      return Icons.numbers;
    case "Shopping and Money":
      return "💰";
    case "Weather and Seasons":
      return "🌤️";
    case "Hobbies and Activities":
      return "🎮";
    case "Holidays and Celebrations":
      return "🎉";
    case "Making Friends":
      return Icons.makefriends;
    case "Music and Arts":
      return "🎸";
    case "Travel and Transportation":
      return "🚗";
    case "At the Restaurant":
      return "🍴";
    case "Sports and Games":
      return "🏊";
    default:
      return "📚";
  }
};
