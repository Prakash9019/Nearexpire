import mongoose from "mongoose"

// --- 1. User Schema ---
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
  avatar: String,
  phone: String,
  address: String,
  greenPoints: { type: Number, default: 0 },
  wasteSavedKg: { type: Number, default: 0 },
  carbonSavedKg: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// --- 2. Product Schema ---
const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: String,
  category: {
    type: String,
    required: true,
    enum: ["soaps", "toothpaste", "shampoos", "detergents", "cleaners", "dishwash", "baby-care", "cosmetics", "grooming"], // Added cosmetics/grooming to match your data
  },
  originalPrice: { type: Number, required: true },
  discountPercentage: Number,
  finalPrice: Number,
  expiryDate: { type: Date, required: true },
  quantity: { type: Number, default: 1 },
  images: [String], // Fixed: Schema said "image: String", but data has "images: [String]"
  sku: String,
  verified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviews: [{ buyerId: String, comment: String, rating: Number, createdAt: Date }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// --- 3. Initialize Models ---
// Note: I commented out models where the Schema was missing from your snippet to prevent crashes.
export const User = mongoose.models.User || mongoose.model("User", userSchema)
export const Product = mongoose.models.Product || mongoose.model("Product", productSchema)

// export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)
// export const SellerVerification = mongoose.models.SellerVerification || mongoose.model("SellerVerification", sellerVerificationSchema)
// export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema)
// export const Shipment = mongoose.models.Shipment || mongoose.model("Shipment", shipmentSchema)
// export const Dispute = mongoose.models.Dispute || mongoose.model("Dispute", disputeSchema)
// export const Payout = mongoose.models.Payout || mongoose.model("Payout", payoutSchema)
// export const InspectionLog = mongoose.models.InspectionLog || mongoose.model("InspectionLog", inspectionLogSchema)
// export const Partner = mongoose.models.Partner || mongoose.model("Partner", partnerSchema)

const seedData = async () => {
  try {
    // ⚠️ WARNING: You have exposed your DB password. 
    // In production, ALWAYS use process.env.DATABASE_URL
    await mongoose.connect("mongodb+srv://plsprakash2003:Surya_2003@cluster0.bpe9m.mongodb.net/NearExpire?retryWrites=true&w=majority")
    console.log("✅ Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Product.deleteMany({})
    console.log("🧹 Cleared existing data")

    // Create sample sellers
    const seller1 = await User.create({
      name: "Freshmart Supplies",
      email: "seller1@nearexpiry.com",
      password: "password123",
      role: "seller",
      phone: "9876543210",
    })

    const seller2 = await User.create({
      name: "EcoCare Wholesalers",
      email: "seller2@nearexpiry.com",
      password: "password123",
      role: "seller",
      phone: "9876543211",      
    })

    console.log("👥 Created sellers")

    // Raw Product Data
    const rawProducts = [
     {
    sellerId: seller1._id,
    name: "Dove Organic Soap 100g",
    category: "soaps",
    description: "Pure and gentle organic soap bar",
    originalPrice: 150,
    discountPercentage: 40,
    quantity: 150,
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226119/search_images/16d9566758261a64b7af9d361957e51806fd7856.jpg",
      "https://pplx-res.cloudinary.com/image/upload/v1764226120/search_images/6013eb2e424d4f15aac5c085a5a5d7e83a6f8b23.jpg"
    ],
  },
  {
    sellerId: seller1._id,
    name: "Colgate Toothpaste 100ml",
    category: "toothpaste",
    description: "Fluoride toothpaste for cavity protection",
    originalPrice: 85,
    discountPercentage: 45,
    quantity: 200,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226119/search_images/24f86f7e83bcddf1dda8f5c7ed78175761ffb501.jpg",
      "https://pplx-res.cloudinary.com/image/upload/v1764226120/search_images/d7299a45d055c1242276251a85c89a4b2e7515c9.jpg"
    ],
  },
  {
    sellerId: seller1._id,
    name: "Head & Shoulders Shampoo 250ml",
    category: "shampoos",
    description: "Anti-dandruff shampoo for healthy scalp",
    originalPrice: 220,
    discountPercentage: 50,
    quantity: 100,
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226119/search_images/9ac52dfc6892616dacb9599c2a0e5e8f3073ea81.jpg",
      "https://pplx-res.cloudinary.com/image/upload/v1764226119/search_images/990e5c2746fd3b6987261259d26ba85039cf30ca.jpg"
    ],
  },
  {
    sellerId: seller2._id,
    name: "Ariel Detergent Powder 1kg",
    category: "detergents",
    description: "Powerful laundry detergent powder",
    originalPrice: 280,
    discountPercentage: 35,
    quantity: 120,
    expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226120/search_images/9de1304b682fee963f2bc7dcf07f8fecbac644c8.jpg",
      "https://pplx-res.cloudinary.com/image/upload/v1764226120/search_images/887e198f383337e4258ed797edc1fcf8892d72d1.jpg"
    ],
  },
  {
    sellerId: seller2._id,
    name: "Lizol Floor Cleaner 500ml",
    category: "cleaners",
    description: "Disinfectant floor cleaner",
    originalPrice: 95,
    discountPercentage: 30,
    quantity: 200,
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226120/search_images/74a6aabb53b9adac36608807ff7aa51eb74c2dbf.jpg",
      "https://pplx-res.cloudinary.com/image/upload/v1764226120/search_images/87d1a0ec1433f3bccf60584c75f8f6e83773c8c0.jpg"
    ],
  },
  {
    sellerId: seller1._id,
    name: "Pampers Baby Wipes 72pcs",
    category: "baby-care",
    description: "Gentle baby wipes for delicate skin",
    originalPrice: 250,
    discountPercentage: 40,
    quantity: 80,
    expiryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226128/search_images/ef2b0ea1c34a0a7e384c0eb65ee8c2aed501ad3c.jpg",
      "https://pplx-res.cloudinary.com/image/upload/v1764226128/search_images/d8add4d12dd7819689e2d2eb000ea804958d076b.jpg"
    ],
  },
  {
    sellerId: seller2._id,
    name: "Maybelline Mascara 8ml",
    category: "cosmetics",
    description: "Long-lasting volumizing mascara",
    originalPrice: 399,
    discountPercentage: 55,
    quantity: 50,
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226128/search_images/a05cf0fea66d050e9b746398d5653ab4c9233949.jpg",
      "https://pplx-res.cloudinary.com/image/upload/v1764226128/search_images/25e1dd5124c0f841c992d4a05b45b604a44ac2840.jpg"
    ],
  },
  {
    sellerId: seller1._id,
    name: "Gillette Shaving Gel 195ml",
    category: "grooming",
    description: "Premium shaving gel for smooth shave",
    originalPrice: 185,
    discountPercentage: 38,
    quantity: 110,
    expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226128/search_images/16f6e9f2ff8d09b383f8b2e9b34e994e99eb78b9.jpg",
      "https://pplx-res.cloudinary.com/image/upload/v1764226128/search_images/5663b0112935694c5ebf110a195e477ff44f91f0.jpg"
    ],
  },
  {
    sellerId: seller2._id,
    name: "Lux Soap Bar 100g (Pack of 3)",
    category: "soaps",
    description: "Premium fragrant soap bars",
    originalPrice: 160,
    discountPercentage: 42,
    quantity: 300,
    expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226128/search_images/b29ca6813a6d5622ce060c5200d81e115b72a2ac.jpg",
      "https://localmart.guru/wp-content/uploads/2025/03/Highcompressed_1457046451.jpeg"
    ],
  },
  {
    sellerId: seller1._id,
    name: "Dabur Toothpaste 200g",
    category: "toothpaste",
    description: "Herbal toothpaste with neem",
    originalPrice: 95,
    discountPercentage: 48,
    quantity: 180,
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226128/search_images/2da13169a36cd1b91cf11027851bcee095aec142.jpg",
      "https://pplx-res.cloudinary.com/image/upload/v1764226128/search_images/2f4f887fd8e88aab40bd3c16632893e2b6a9c0fd.jpg"
    ],
  },
  {
    sellerId: seller2._id,
    name: "Sunsilk Shampoo 180ml",
    category: "shampoos",
    description: "Damage repair shampoos",
    originalPrice: 165,
    discountPercentage: 52,
    quantity: 140,
    expiryDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226136/search_images/36b1ad6ba40e7b47eb58f71e09a3588bf626c2fe.jpg",
      "https://pplx-res.cloudinary.com/image/upload/v1764226136/search_images/e6102805f5877fd6cc119175484311a2b67d1c47.jpg"
    ],
  },
  {
    sellerId: seller1._id,
    name: "Surf Excel Detergent 500g",
    category: "detergents",
    description: "Quick wash detergent powder",
    originalPrice: 150,
    discountPercentage: 33,
    quantity: 250,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226136/search_images/8f91ccb62a25f8ef0e81c4facade20b05b224ecf.jpg",
      "https://pplx-res.cloudinary.com/image/upload/v1764226136/search_images/2691bf52b567870f9f767c19cebabca05442675a.jpg"
    ],
  },
  {
    sellerId: seller2._id,
    name: "Harpic Toilet Cleaner 500ml",
    category: "cleaners",
    description: "Powerful toilet cleaner liquid",
    originalPrice: 120,
    discountPercentage: 28,
    quantity: 160,
    expiryDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226136/search_images/69c2675c22cf1823067754fbf2a3f043e7207369.jpg",
      "https://pplx-res.cloudinary.com/image/upload/v1764226136/search_images/39a5d4d072b2c36d22f565eb4d73ff5ea6e09869.jpg"
    ],
  },
  {
    sellerId: seller1._id,
    name: "Johnson Baby Lotion 200ml",
    category: "baby-care",
    description: "Gentle baby lotion for soft skin",
    originalPrice: 230,
    discountPercentage: 36,
    quantity: 95,
    expiryDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226136/search_images/7007bbf8c325461f805579d10e4dc34849efd524.jpg",
      "https://pplx-res.cloudinary.com/image/upload/v1764226136/search_images/819bae4f16cd13ffbc09505d27748c512226e3b0.jpg"
    ],
  },
  {
    sellerId: seller2._id,
    name: "Lakme Compact Powder 18g",
    category: "cosmetics",
    description: "Long stay compact powder",
    originalPrice: 310,
    discountPercentage: 50,
    quantity: 75,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    images: [
      "https://pplx-res.cloudinary.com/image/upload/v1764226136/search_images/6876579968f38bae9c81061cd260090740b5412f.jpg",
      "https://pplx-res.cloudinary.com/image/upload/v1764226136/search_images/018e38a20f06a0e722e5f34183d9d6580aeecd9c.jpg"
    ],
  },
    ];

    // Calculate Final Price and Process
    const processedProducts = rawProducts.map(product => ({
      ...product,
      finalPrice: Math.round(product.originalPrice * (1 - product.discountPercentage / 100))
    }));

    const createdProducts = await Product.insertMany(processedProducts)
    console.log(`📦 Created ${createdProducts.length} products`)

    // Create sample buyers
    const buyer1 = await User.create({
      name: "Rajesh Kumar",
      email: "buyer1@nearexpiry.com",
      password: "password123",
      role: "buyer",
      phone: "9999999999",
    })

    const buyer2 = await User.create({
      name: "Priya Singh",
      email: "buyer2@nearexpiry.com",
      password: "password123",
      role: "buyer",
      phone: "8888888888",
    })

    console.log("👥 Created sample buyers")

    console.log("\n=== SAMPLE DATA CREATED SUCCESSFULLY ===\n")
    console.log("Seller 1: seller1@nearexpiry.com")
    console.log("Buyer 1:  buyer1@nearexpiry.com")
    console.log("Password: password123")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding data:", error)
    process.exit(1)
  }
}

seedData()