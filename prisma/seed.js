import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const foodData = [
  { name: "alpukat", calories: 322, unit: "1 buah", imageUrl: "/images/alpukat_utuh.png" },
  { name: "alpukat", calories: 161, unit: "setengah", imageUrl: "/images/alpukat_setengah.png" },
  { name: "ampela", calories: 32, unit: "1 porsi", imageUrl: "/images/ampela.png" },
  { name: "anggur", calories: 3, unit: "1 buah", imageUrl: "/images/anggur.png" },
  { name: "apel", calories: 72, unit: "1 buah", imageUrl: "/images/apel.png" },
  { name: "ati ayam", calories: 35, unit: "1 porsi", imageUrl: "/images/ati_ayam.png" },
  { name: "babi panggang", calories: 210, unit: "1 porsi", imageUrl: "/images/babi_panggang.png" },
  { name: "bakso", calories: 225, unit: "1 porsi", imageUrl: "/images/bakso.png" },
  { name: "bayam", calories: 37, unit: "1 porsi", imageUrl: "/images/bayam.png" },
  { name: "bebek", calories: 132, unit: "1 porsi", imageUrl: "/images/bebek.png" },
  { name: "bihun", calories: 109, unit: "1 porsi", imageUrl: "/images/bihun.png" },
  { name: "brokoli", calories: 32, unit: "1 porsi", imageUrl: "/images/brokoli.png" },
  { name: "brownies", calories: 129, unit: "1 buah", imageUrl: "/images/brownies.png" },
  { name: "buah naga", calories: 50, unit: "1 buah", imageUrl: "/images/buah_naga.png" },
  { name: "bubur ayam", calories: 372, unit: "1 porsi", imageUrl: "/images/bubur_ayam_full.png" },
  { name: "bubur ayam", calories: 186, unit: "1/2 porsi", imageUrl: "/images/bubur_ayam_half.png" },
  { name: "buncis", calories: 34, unit: "1 porsi", imageUrl: "/images/buncis.png" },
  { name: "chicken nugget", calories: 48, unit: "1 buah", imageUrl: "/images/chicken_nugget.png" },
  { name: "cumi asin", calories: 95, unit: "1 porsi", imageUrl: "/images/cumi_asin.png" },
  { name: "cumi goreng", calories: 106, unit: "1 porsi", imageUrl: "/images/cumi_goreng.png" },
  { name: "dada ayam", calories: 195, unit: "1 porsi", imageUrl: "/images/dada_ayam.png" },
  { name: "dada ayam bakar", calories: 165, unit: "1 porsi", imageUrl: "/images/dada_ayam_bakar.png" },
  { name: "dada ayam goreng", calories: 216, unit: "1 porsi", imageUrl: "/images/dada_ayam_goreng.png" },
  { name: "daging semur", calories: 141, unit: "1 porsi", imageUrl: "/images/daging_semur.png" },
  { name: "dendeng", calories: 82, unit: "1 buah", imageUrl: "/images/dendeng.png" },
  { name: "donat", calories: 192, unit: "1 buah", imageUrl: "/images/donat.png" },
  { name: "ice cream", calories: 179, unit: "1 porsi", imageUrl: "/images/ice_cream.png" },
  { name: "ikan asin", calories: 195, unit: "1 porsi", imageUrl: "/images/ikan_asin.png" },
  { name: "ikan lele", calories: 204, unit: "1 porsi", imageUrl: "/images/ikan_lele.png" },
  { name: "ikan panggang", calories: 126, unit: "1 porsi", imageUrl: "/images/ikan_panggang.png" },
  { name: "ikan sarden", calories: 120, unit: "1 porsi", imageUrl: "/images/ikan_sarden.png" },
  { name: "ikan teri", calories: 94, unit: "1 porsi", imageUrl: "/images/ikan_teri.png" },
  { name: "indomie goreng", calories: 400, unit: "1 bungkus", imageUrl: "/images/indomie_goreng.png" },
  { name: "indomie goreng jumbo", calories: 570, unit: "1 bungkus", imageUrl: "/images/indomie_goreng_jumbo.png" },
  { name: "indomie rebus", calories: 400, unit: "1 bungkus", imageUrl: "/images/indomie_rebus.png" },
  { name: "jagung", calories: 77, unit: "1 buah", imageUrl: "/images/jagung.png" },
  { name: "jamur tiram", calories: 35, unit: "1 buah", imageUrl: "/images/jamur_tiram.png" },
  { name: "jengkol", calories: 96, unit: "1 porsi", imageUrl: "/images/jengkol.png" },
  { name: "jeruk", calories: 62, unit: "1 buah", imageUrl: "/images/jeruk.png" },
  { name: "jus alpukat", calories: 195, unit: "1 gelas", imageUrl: "/images/jus_alpukat.png" },
  { name: "jus jeruk", calories: 112, unit: "1 gelas", imageUrl: "/images/jus_jeruk.png" },
  { name: "jus sirsak", calories: 68, unit: "1 gelas", imageUrl: "/images/jus_sirsak.png" },
  { name: "kacang almond", calories: 7, unit: "1 butir", imageUrl: "/images/kacang_almond.png" },
  { name: "kangkung", calories: 106, unit: "1 porsi", imageUrl: "/images/kangkung.png" },
  { name: "kentang balado", calories: 51, unit: "1 porsi", imageUrl: "/images/kentang_balado.png" },
  { name: "kentang goreng (frech fried)", calories: 192, unit: "1 porsi", imageUrl: "/images/kentang_goreng.png" },
  { name: "keripik kentang", calories: 153, unit: "1 porsi", imageUrl: "/images/keripik_kentang.png" },
  { name: "kerupuk", calories: 15, unit: "1 buah", imageUrl: "/images/kerupuk.png" },
  { name: "kikil", calories: 80, unit: "1 tusuk", imageUrl: "/images/kikil.png" },
  { name: "kopi hitam", calories: 2, unit: "1 gelas", imageUrl: "/images/kopi_hitam.png" },
  { name: "kopi latte", calories: 135, unit: "1 gelas", imageUrl: "/images/kopi_latte.png" },
  { name: "kurma", calories: 23, unit: "1 buah", imageUrl: "/images/kurma.png" },
  { name: "macaroni keju", calories: 203, unit: "1 porsi", imageUrl: "/images/macaroni_keju.png" },
  { name: "mangga", calories: 135, unit: "1 buahh", imageUrl: "/images/mangga.png" },
  { name: "melon", calories: 60, unit: "1 porsi", imageUrl: "/images/melon.png" },
  { name: "nanas", calories: 74, unit: "1 porsi", imageUrl: "/images/nanas.png" },
  { name: "nasi", calories: 129, unit: "1 porsi", imageUrl: "/images/nasi.png" },
  { name: "nasi", calories: 65, unit: "1/2 porsi", imageUrl: "/images/nasi.png" },
  { name: "nasi goreng", calories: 250, unit: "1 porsi", imageUrl: "/images/nasi_goreng.png" },
  { name: "nasi merah", calories: 110, unit: "1 porsi", imageUrl: "/images/nasi_merah.png" },
  { name: "nasi merah", calories: 55, unit: "1/2 porsi", imageUrl: "/images/nasi_merah.png" },
  { name: "oatmeal", calories: 97, unit: "1 porsi", imageUrl: "/images/oatmeal.png" },
  { name: "paha ayam", calories: 245, unit: "1 porsi", imageUrl: "/images/paha_ayam.png" },
  { name: "paha ayam bakar", calories: 152, unit: "1 porsi", imageUrl: "/images/paha_ayam_bakar.png" },
  { name: "paha ayam goreng", calories: 243, unit: "1 porsi", imageUrl: "/images/paha_ayam_goreng.png" },
  { name: "papaya", calories: 55, unit: "1 porsi", imageUrl: "/images/papaya.png" },
  { name: "perkedel", calories: 21, unit: "1 buah", imageUrl: "/images/perkedel.png" },
  { name: "pir", calories: 96, unit: "1 buah", imageUrl: "/images/pir.png" },
  { name: "pizza", calories: 256, unit: "1 buah", imageUrl: "/images/pizza.png" },
  { name: "pudding", calories: 157, unit: "1 porsi", imageUrl: "/images/pudding.png" },
  { name: "rendang", calories: 193, unit: "1 porsi", imageUrl: "/images/rendang.png" },
  { name: "roti gandum", calories: 67, unit: "1 buah", imageUrl: "/images/roti_gandum.png" },
  { name: "roti putih", calories: 66, unit: "1 buah", imageUrl: "/images/roti_putih.png" },
  { name: "salad", calories: 9, unit: "1 porsi", imageUrl: "/images/salad.png" },
  { name: "sate ati ampela", calories: 32, unit: "1 tusuk", imageUrl: "/images/sate_ati_ampela.png" },
  { name: "sate ayam", calories: 34, unit: "1 tusuk", imageUrl: "/images/sate_ayam.png" },
  { name: "sate kambing", calories: 32, unit: "1 tusuk", imageUrl: "/images/sate_kambing.png" },
  { name: "sate maranggi", calories: 38, unit: "1 tusuk", imageUrl: "/images/sate_maranggi.png" },
  { name: "sate padang", calories: 24, unit: "1 tusuk", imageUrl: "/images/sate_padang.png" },
  { name: "sate taichan", calories: 36, unit: "1 tusuk", imageUrl: "/images/sate_taichan.png" },
  { name: "sate usus", calories: 21, unit: "1 tusuk", imageUrl: "/images/sate_usus.png" },
  { name: "sayap ayam bakar", calories: 160, unit: "1 porsi", imageUrl: "/images/sayap_ayam_bakar.png" },
  { name: "sayap ayam goreng", calories: 160, unit: "1 porsi", imageUrl: "/images/sayap_ayam_goreng.png" },
  { name: "sayur asem", calories: 80, unit: "1 porsi", imageUrl: "/images/sayur_asem.png" },
  { name: "sayur labu", calories: 58, unit: "1 porsi", imageUrl: "/images/sayur_labu.png" },
  { name: "sayur lodeh", calories: 162, unit: "1 porsi", imageUrl: "/images/sayur_lodeh.png" },
  { name: "sayur Nangka", calories: 57, unit: "1 porsi", imageUrl: "/images/sayur_nangka.png" },
  { name: "sayur sop", calories: 60, unit: "1 porsi", imageUrl: "/images/sayur_sop.png" },
  { name: "semangka", calories: 46, unit: "1 porsi", imageUrl: "/images/semangka.png" },
  { name: "sosis ayam", calories: 49, unit: "1 buah", imageUrl: "/images/sosis_ayam.png" },
  { name: "sosis sapi", calories: 42, unit: "1 buah", imageUrl: "/images/sosis_sapi.png" },
  { name: "soto ayam", calories: 312, unit: "1 porsi", imageUrl: "/images/soto_ayam.png" },
  { name: "soto daging", calories: 219, unit: "1 porsi", imageUrl: "/images/soto_daging.png" },
  { name: "soto mie", calories: 370, unit: "1 porsi", imageUrl: "/images/soto_mie.png" },
  { name: "spageti wow", calories: 360, unit: "1 bungkus", imageUrl: "/images/spageti_wow.png" },
  { name: "tahu goreng", calories: 35, unit: "1 buah", imageUrl: "/images/tahu_goreng.png" },
  { name: "tauge", calories: 29, unit: "1 porsi", imageUrl: "/images/tauge.png" },
  { name: "teh manis", calories: 55, unit: "1 gelas", imageUrl: "/images/teh_manis.png" },
  { name: "teh tawar", calories: 2, unit: "1 gelas", imageUrl: "/images/teh_tawar.png" },
  { name: "telur ceplok", calories: 92, unit: "1 porsi", imageUrl: "/images/telur_ceplok.png" },
  { name: "telur dadar", calories: 93, unit: "1 buah", imageUrl: "/images/telur_dadar.png" },
  { name: "telur rebus", calories: 68, unit: "1 butir", imageUrl: "/images/telur_rebus.png" },
  { name: "tempe", calories: 175, unit: "1 buah", imageUrl: "/images/tempe.png" },
  { name: "tempe goreng", calories: 34, unit: "1 buah", imageUrl: "/images/tempe_goreng.png" },
  { name: "tomat", calories: 22, unit: "1 buah", imageUrl: "/images/tomat.png" },
  { name: "udang", calories: 9, unit: "1 buah", imageUrl: "/images/udang.png" },
  { name: "udang", calories: 122, unit: "1 porsi", imageUrl: "/images/udang_porsi.png" },
  { name: "udang goreng tepung", calories: 245, unit: "1 porsi", imageUrl: "/images/udang_goreng_tepung.png" },
  { name: "usus", calories: 94, unit: "1 porsi", imageUrl: "/images/usus.png" },
  { name: "wafer coklat", calories: 26, unit: "1 buah", imageUrl: "/images/wafer_coklat.png" },
  { name: "wortel", calories: 41, unit: "1 porsi", imageUrl: "/images/wortel.png" }
];

const articlesData = [
  { 
    title: "TDEE dan Kesehatan Sistem Imun", 
    content: `<div class='space-y-6 pb-20'>
      <div class="flex items-center space-x-4 mb-6">
        <img src="/images/articleImages/joko.jpg" alt="Dr. Joko Susilo" class="w-16 h-16 rounded-full object-cover">
        <div>
          <h3 class="font-semibold text-gray-800">Dr. Joko Susilo</h3>
          <p class="text-sm text-gray-600">Ahli Gizi & Nutrisi</p>
        </div>
      </div>
      <h1>TDEE dan Kesehatan Sistem Imun: Kunci Pertahanan Tubuh yang Kuat</h1>
      // ... rest of the content ...
    </div>`, 
    image_path: "/images/articleImages/tdee50.jpg", 
    category: "Immune System",
    author_name: "Dr. Joko Susilo",
    author_image: "/images/articleImages/joko.jpg",
    author_title: "Ahli Gizi & Nutrisi"
  },
  { 
    title: "TDEE dan Manajemen Stres", 
    content: `<div class='space-y-6 pb-20'>
      <div class="flex items-center space-x-4 mb-6">
        <img src="/images/articleImages/marsya.svg" alt="Marsya Putri" class="w-16 h-16 rounded-full object-cover">
        <div>
          <h3 class="font-semibold text-gray-800">Marsya Putri</h3>
          <p class="text-sm text-gray-600">Psikolog & Wellness Coach</p>
        </div>
      </div>
      <h1>TDEE dan Manajemen Stres: Keseimbangan Energi untuk Ketenangan Pikiran</h1>
      // ... rest of the content ...
    </div>`, 
    image_path: "/images/articleImages/tdee49.jpg", 
    category: "Stress Management",
    author_name: "Marsya Putri",
    author_image: "/images/articleImages/marsya.svg",
    author_title: "Psikolog & Wellness Coach"
  },
  { 
    title: "TDEE dan Kualitas Tidur", 
    content: `<div class='space-y-6 pb-20'>
      <div class="flex items-center space-x-4 mb-6">
        <img src="/images/articleImages/budi.jpg" alt="Budi Santoso" class="w-16 h-16 rounded-full object-cover">
        <div>
          <h3 class="font-semibold text-gray-800">Budi Santoso</h3>
          <p class="text-sm text-gray-600">Sleep Specialist & Health Coach</p>
        </div>
      </div>
      <h1>TDEE dan Kualitas Tidur: Rahasia Kesehatan Optimal</h1>
      // ... rest of the content ...
    </div>`, 
    image_path: "/images/articleImages/tdee48.jpg", 
    category: "Sleep",
    author_name: "Budi Santoso",
    author_image: "/images/articleImages/budi.jpg",
    author_title: "Sleep Specialist & Health Coach"
  },
  { 
    title: "TDEE dan Kesehatan Mental", 
    content: `<div class='space-y-6 pb-20'>
      <div class="flex items-center space-x-4 mb-6">
        <img src="/images/articleImages/nilon.jpg" alt="Nilon Wijaya" class="w-16 h-16 rounded-full object-cover">
        <div>
          <h3 class="font-semibold text-gray-800">Nilon Wijaya</h3>
          <p class="text-sm text-gray-600">Mental Health Expert & Nutritionist</p>
        </div>
      </div>
      <h1>TDEE dan Kesehatan Mental: Keseimbangan Energi untuk Pikiran yang Sehat</h1>
      // ... rest of the content ...
    </div>`, 
    image_path: "/images/articleImages/tdee47.webp", 
    category: "Mental Health",
    author_name: "Nilon Wijaya",
    author_image: "/images/articleImages/nilon.jpg",
    author_title: "Mental Health Expert & Nutritionist"
  }
];

async function main() {
  console.log('Start seeding...');
  
  // Delete existing data
  await prisma.food.deleteMany();
  await prisma.article.deleteMany();
  
  // Create admin user if not exists
  const admin = await prisma.admin.upsert({
    where: { adminId: 1 },
    update: {},
    create: {
      adminId: 1,
      admin_name: 'Admin TDEE',
      email: 'admin@tdeecalculator.com',
      password: 123456
    }
  });
  
  // Insert food data
  for (const food of foodData) {
    await prisma.food.create({
      data: {
        ...food,
        updatedAt: new Date()
      }
    });
  }
  
  // Insert articles data
  for (const article of articlesData) {
    await prisma.article.create({
      data: {
        title: article.title,
        content: article.content,
        image_path: article.image_path,
        category: article.category,
        author_name: article.author_name,
        author_image: article.author_image,
        author_title: article.author_title,
        author_id: admin.adminId,
        status: 'Published',
        views: 0,
        likes: 0
      }
    });
  }
  
  // Ensure profile exists for user with email aryariyanto29@gmail.com
  const yourUser = await prisma.user.findFirst({
    where: { email: 'aryariyanto29@gmail.com' },
    include: { profile: true }
  });

  if (yourUser && !yourUser.profile) {
    const yourProfile = await prisma.profile.create({
      data: {
        userId: yourUser.userId,
        full_name: 'Arya Riyanto',
        birth_date: new Date('2000-01-01'),
        birth_place: 'Jakarta',
        address: 'bekasi',
        phone_number: yourUser.number_phone,
        email: yourUser.email,
        gender: 'Male',
        avatar: null
      }
    });
    console.log(`Created profile for your user with id: ${yourProfile.userId}`);
  } else if (yourUser) {
    console.log(`Profile for user ${yourUser.email} (ID ${yourUser.userId}) already exists, skipping creation.`);
  } else {
    console.log('User with email aryariyanto29@gmail.com not found, skipping profile creation.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 