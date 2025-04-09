const dummyUsers = [
  {
    userId: "USR001",
    schoolid: "SCH001",
    pin: "1234",
    username: "Ife Babalola Adesina",
    password: "password",
    Role: "Student",
    profilePic: "/female.png",
    class: "JSS 1",
    fees: [
      {
        purpose: "Admission Acceptance Fee",
        TransactionNumber: "TD01",
        AmountBilled: 52000,
        AmountPaid: 52000,
        PaymentDate: "07/09/23",
      },
      {
        purpose: "School fees for 1st Term",
        TransactionNumber: "TD02",
        AmountBilled: 250000,
        AmountPaid: 0,
        PaymentDate: "Pending",
      },
      {
        purpose: "PTA dues",
        TransactionNumber: "TD03",
        AmountBilled: 2000,
        AmountPaid: 0,
        PaymentDate: "Pending",
      },
      {
        purpose: "Extracurricular Sports Mentorship",
        TransactionNumber: "TD04",
        AmountBilled: 20000,
        AmountPaid: 20000,
        PaymentDate: "07/09/23",
      },
      {
        purpose: "Payment Charge",
        TransactionNumber: "PC01",
        AmountBilled: 650,
        AmountPaid: 0,
        PaymentDate: "Pending",
      },
    ],
    receipts: [
      {
        purpose: "Admission Acceptance Fee",
        TransactionNumber: "TD01",
        AmountBilled: 52000,
        AmountPaid: 52000,
        // PaymentDate: "07/09/23", // Removed from receipts
      },
      {
        purpose: "Extracurricular Sports Mentorship",
        TransactionNumber: "TD04",
        AmountBilled: 20000,
        AmountPaid: 20000,
        //PaymentDate: "07/09/23", // Removed from receipts
      },
    ],
  },
  {
    userId: "USR002",
    schoolid: "SCH002",
    pin: "5678",
    username: "Jane Smith",
    password: "password",
    Role: "Teacher",
    profilePic: "/profile.png",
  },
  {
    userId: "USR003",
    schoolid: "SCH003",
    pin: "9012",
    username: "Bob Johnson",

    password: "password",
    Role: "Student",
    class: "JSS 1",
    profilePic: "/female.png",
    fees: [
      {
        purpose: "Admission Acceptance Fee",
        TransactionNumber: "TD01",
        AmountBilled: 52000,
        AmountPaid: 52000,
        PaymentDate: "07/09/23",
      },
      {
        purpose: "School fees for 1st Term",
        TransactionNumber: "TD02",
        AmountBilled: 250000,
        AmountPaid: 0,
        PaymentDate: "Pending",
      },
      {
        purpose: "PTA dues",
        TransactionNumber: "TD03",
        AmountBilled: 2000,
        AmountPaid: 0,
        PaymentDate: "Pending",
      },
      {
        purpose: "Extracurricular Sports Mentorship",
        TransactionNumber: "TD04",
        AmountBilled: 20000,
        AmountPaid: 20000,
        PaymentDate: "07/09/23",
      },
      {
        purpose: "Payment Charge",
        TransactionNumber: "PC01",
        AmountBilled: 650,
        AmountPaid: 0,
        PaymentDate: "Pending",
      },
    ],
    receipts: [
      {
        purpose: "Admission Acceptance Fee",
        TransactionNumber: "TD01",
        AmountBilled: 52000,
        AmountPaid: 52000,
        // PaymentDate: "07/09/23", // Removed from receipts
      },
      {
        purpose: "Extracurricular Sports Mentorship",
        TransactionNumber: "TD04",
        AmountBilled: 20000,
        AmountPaid: 20000,
        //PaymentDate: "07/09/23", // Removed from receipts
      },
    ],
  },
  {
    userId: "USR004",
    schoolid: "SCH004",
    pin: "3456",
    username: "Mary Lee",
    password: "password",
    Role: "Student",
    profilePic: "/profile.png",
    fees: [
      {
        purpose: "Admission Acceptance Fee",
        TransactionNumber: "TD01",
        AmountBilled: 52000,
        AmountPaid: 52000,
        PaymentDate: "07/09/23",
      },
      {
        purpose: "School fees for 1st Term",
        TransactionNumber: "TD02",
        AmountBilled: 250000,
        AmountPaid: 0,
        PaymentDate: "Pending",
      },
      {
        purpose: "PTA dues",
        TransactionNumber: "TD03",
        AmountBilled: 2000,
        AmountPaid: 0,
        PaymentDate: "Pending",
      },
      {
        purpose: "Extracurricular Sports Mentorship",
        TransactionNumber: "TD04",
        AmountBilled: 20000,
        AmountPaid: 20000,
        PaymentDate: "07/09/23",
      },
      {
        purpose: "Payment Charge",
        TransactionNumber: "PC01",
        AmountBilled: 650,
        AmountPaid: 0,
        PaymentDate: "Pending",
      },
    ],
    receipts: [
      {
        purpose: "Admission Acceptance Fee",
        TransactionNumber: "TD01",
        AmountBilled: 52000,
        AmountPaid: 52000,
        // PaymentDate: "07/09/23", // Removed from receipts
      },
      {
        purpose: "Extracurricular Sports Mentorship",
        TransactionNumber: "TD04",
        AmountBilled: 20000,
        AmountPaid: 20000,
        //PaymentDate: "07/09/23", // Removed from receipts
      },
    ],
  },
  {
    userId: "USR005",
    schoolid: "SCH005",
    pin: "7890",
    username: "Tom Brown",
    password: "password",
    Role: "Student",
    profilePic: "/profile.png",
    fees: [
      {
        purpose: "Admission Acceptance Fee",
        TransactionNumber: "TD01",
        AmountBilled: 52000,
        AmountPaid: 52000,
        PaymentDate: "07/09/23",
      },
      {
        purpose: "School fees for 1st Term",
        TransactionNumber: "TD02",
        AmountBilled: 250000,
        AmountPaid: 0,
        PaymentDate: "Pending",
      },
      {
        purpose: "PTA dues",
        TransactionNumber: "TD03",
        AmountBilled: 2000,
        AmountPaid: 0,
        PaymentDate: "Pending",
      },
      {
        purpose: "Extracurricular Sports Mentorship",
        TransactionNumber: "TD04",
        AmountBilled: 20000,
        AmountPaid: 20000,
        PaymentDate: "07/09/23",
      },
      {
        purpose: "Payment Charge",
        TransactionNumber: "PC01",
        AmountBilled: 650,
        AmountPaid: 0,
        PaymentDate: "Pending",
      },
    ],
    receipts: [
      {
        purpose: "Admission Acceptance Fee",
        TransactionNumber: "TD01",
        AmountBilled: 52000,
        AmountPaid: 52000,
        // PaymentDate: "07/09/23", // Removed from receipts
      },
      {
        purpose: "Extracurricular Sports Mentorship",
        TransactionNumber: "TD04",
        AmountBilled: 20000,
        AmountPaid: 20000,
        //PaymentDate: "07/09/23", // Removed from receipts
      },
    ],
  },
  {
    userId: "USR006",
    schoolid: "SCH002",
    pin: "5678",
    username: "Jane Doe",
    password: "password",
    Role: "Super Admin",
    profilePic: "/superadmin.png",
  },
];
export default dummyUsers;
