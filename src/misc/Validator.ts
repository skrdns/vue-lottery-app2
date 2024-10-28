export class Validator {
    static validateName(name: string): string {
      //перевірка на порожнє значення
      if (!name || name.trim() === "") {
        return "Name is required.";
      }
      //перевірка мінімальної довжини імені
      if (name.length < 2) {
        return "Name must be at least 2 characters long.";
      }
      return ""; //якщо помилок немає
    }
  
    static validateDateOfBirth(dateOfBirth: string, today: string): string {
      if (!dateOfBirth) {
        return "Date of birth is required.";
      }
      if (new Date(dateOfBirth) > new Date(today)) {
        return "Date of birth cannot be in the future.";
      }
      return "";
    }
  
    static validateEmail(email: string): string {
      if (!email) {
        return "Email is required.";
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return "Invalid email format.";
      }
      return "";
    }
  
    static validatePhoneNumber(phoneNumber: string): string {
      if (!phoneNumber) {
        return "Phone number is required.";
      }
      const phonePattern = /^\+?\d{10,15}$/;
      if (!phonePattern.test(phoneNumber)) {
        return "Invalid phone number format.";
      }
      return "";
    }
  }
  