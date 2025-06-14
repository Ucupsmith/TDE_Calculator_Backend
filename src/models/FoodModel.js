import prisma from '../../prisma/prismaClient.js';

const foodData = [
  {
    id: 1, // Tambahkan ID
    name: 'alpukat',
    calories: 322,
    unit: '1 buah',
    imageUrl: '/images/alpukat_utuh.png'
  },
  {
    id: 2, // Tambahkan ID
    name: 'alpukat',
    calories: 161,
    unit: 'setengah',
    imageUrl: '/images/alpukat_setengah.png'
  },
  {
    id: 3, // Tambahkan ID
    name: 'ampela',
    calories: 32,
    unit: '1 porsi',
    imageUrl: '/images/ampela.png'
  },
  {
    id: 4, // Tambahkan ID
    name: 'anggur',
    calories: 3,
    unit: '1 buah',
    imageUrl: '/images/anggur.png'
  },
  {
    id: 5,
    name: 'apel',
    calories: 72,
    unit: '1 buah',
    imageUrl: '/images/apel.png'
  },
  {
    id: 6, // Tambahkan ID
    name: 'ati ayam',
    calories: 35,
    unit: '1 porsi',
    imageUrl: '/images/ati_ayam.png'
  },
  {
    id: 7, // Tambahkan ID
    name: 'babi panggang',
    calories: 210,
    unit: '1 porsi',
    imageUrl: '/images/babi_panggang.png'
  },
  {
    id: 8, // Tambahkan ID
    name: 'bakso',
    calories: 225,
    unit: '1 porsi',
    imageUrl: '/images/bakso.png'
  },
  {
    id: 9, // Tambahkan ID
    name: 'bayam',
    calories: 37,
    unit: '1 porsi',
    imageUrl: '/images/bayam.png'
  },
  {
    id: 10, // Tambahkan ID
    name: 'bebek',
    calories: 132,
    unit: '1 porsi',
    imageUrl: '/images/bebek.png'
  },
  {
    id: 11, // Tambahkan ID
    name: 'bihun',
    calories: 109,
    unit: '1 porsi',
    imageUrl: '/images/bihun.png'
  },
  {
    id: 12, // Tambahkan ID
    name: 'brokoli',
    calories: 32,
    unit: '1 porsi',
    imageUrl: '/images/brokoli.png'
  },
  {
    id: 13, // Tambahkan ID
    name: 'brownies',
    calories: 129,
    unit: '1 buah',
    imageUrl: '/images/brownies.png'
  },
  {
    id: 14, // Tambahkan ID
    name: 'buah naga',
    calories: 50,
    unit: '1 buah',
    imageUrl: '/images/buah_naga.png'
  },
  {
    id: 15, // Tambahkan ID
    name: 'bubur ayam',
    calories: 372,
    unit: '1 porsi',
    imageUrl: '/images/bubur_ayam_full.png'
  },
  {
    id: 16, // Tambahkan ID
    name: 'bubur ayam',
    calories: 186,
    unit: '1/2 porsi',
    imageUrl: '/images/bubur_ayam_half.png'
  },
  {
    id: 17, // Tambahkan ID
    name: 'buncis',
    calories: 34,
    unit: '1 porsi',
    imageUrl: '/images/buncis.png'
  },
  {
    id: 18, // Tambahkan ID
    name: 'chicken nugget',
    calories: 48,
    unit: '1 buah',
    imageUrl: '/images/chicken_nugget.png'
  },
  {
    id: 19, // Tambahkan ID
    name: 'cumi asin',
    calories: 95,
    unit: '1 porsi',
    imageUrl: '/images/cumi_asin.png'
  },
  {
    id: 20, // Tambahkan ID
    name: 'cumi goreng',
    calories: 106,
    unit: '1 porsi',
    imageUrl: '/images/cumi_goreng.png'
  },
  {
    id: 21, // Tambahkan ID
    name: 'dada ayam',
    calories: 195,
    unit: '1 porsi',
    imageUrl: '/images/dada_ayam.png'
  },
  {
    id: 22, // Tambahkan ID
    name: 'dada ayam bakar',
    calories: 165,
    unit: '1 porsi',
    imageUrl: '/images/dada_ayam_bakar.png'
  },
  {
    id: 23, // Tambahkan ID
    name: 'dada ayam goreng',
    calories: 216,
    unit: '1 porsi',
    imageUrl: '/images/dada_ayam_goreng.png'
  },
  {
    id: 24, // Tambahkan ID
    name: 'daging semur',
    calories: 141,
    unit: '1 porsi',
    imageUrl: '/images/daging_semur.png'
  },
  {
    id: 25, // Tambahkan ID
    name: 'dendeng',
    calories: 82,
    unit: '1 buah',
    imageUrl: '/images/dendeng.png'
  },
  {
    id: 26, // Tambahkan ID
    name: 'donat',
    calories: 192,
    unit: '1 buah',
    imageUrl: '/images/donat.png'
  },
  {
    id: 27, // Tambahkan ID
    name: 'ice cream',
    calories: 179,
    unit: '1 porsi',
    imageUrl: '/images/ice_cream.png'
  },
  {
    id: 28, // Tambahkan ID
    name: 'ikan asin',
    calories: 195,
    unit: '1 porsi',
    imageUrl: '/images/ikan_asin.png'
  },
  {
    id: 29, // Tambahkan ID
    name: 'ikan lele',
    calories: 204,
    unit: '1 porsi',
    imageUrl: '/images/ikan_lele.png'
  },
  {
    id: 30, // Tambahkan ID
    name: 'ikan panggang',
    calories: 126,
    unit: '1 porsi',
    imageUrl: '/images/ikan_panggang.png'
  },
  {
    id: 31, // Tambahkan ID
    name: 'ikan sarden',
    calories: 120,
    unit: '1 porsi',
    imageUrl: '/images/ikan_sarden.png'
  },
  {
    id: 32, // Tambahkan ID
    name: 'ikan teri',
    calories: 94,
    unit: '1 porsi',
    imageUrl: '/images/ikan_teri.png'
  },
  {
    id: 33, // Tambahkan ID
    name: 'indomie goreng',
    calories: 400,
    unit: '1 bungkus',
    imageUrl: '/images/indomie_goreng.png'
  },
  {
    id: 34, // Tambahkan ID
    name: 'indomie goreng jumbo',
    calories: 570,
    unit: '1 bungkus',
    imageUrl: '/images/indomie_goreng_jumbo.png'
  },
  {
    id: 35, // Tambahkan ID
    name: 'indomie rebus',
    calories: 400,
    unit: '1 bungkus',
    imageUrl: '/images/indomie_rebus.png'
  },
  {
    id: 36, // Tambahkan ID
    name: 'jagung',
    calories: 77,
    unit: '1 buah',
    imageUrl: '/images/jagung.png'
  },
  {
    id: 37, // Tambahkan ID
    name: 'jamur tiram',
    calories: 35,
    unit: '1 buah',
    imageUrl: '/images/jamur_tiram.png'
  },
  {
    id: 38, // Tambahkan ID
    name: 'jengkol',
    calories: 96,
    unit: '1 porsi',
    imageUrl: '/images/jengkol.png'
  },
  {
    id: 39, // Tambahkan ID
    name: 'jeruk',
    calories: 62,
    unit: '1 buah',
    imageUrl: '/images/jeruk.png'
  },
  {
    id: 40, // Tambahkan ID
    name: 'jus alpukat',
    calories: 195,
    unit: '1 gelas',
    imageUrl: '/images/jus_alpukat.png'
  },
  {
    id: 41, // Tambahkan ID
    name: 'jus jeruk',
    calories: 112,
    unit: '1 gelas',
    imageUrl: '/images/jus_jeruk.png'
  },
  {
    id: 42, // Tambahkan ID
    name: 'jus sirsak',
    calories: 68,
    unit: '1 gelas',
    imageUrl: '/images/jus_sirsak.png'
  },
  {
    id: 43, // Tambahkan ID
    name: 'kacang almond',
    calories: 7,
    unit: '1 butir',
    imageUrl: '/images/kacang_almond.png'
  },
  {
    id: 44, // Tambahkan ID
    name: 'kangkung',
    calories: 106,
    unit: '1 porsi',
    imageUrl: '/images/kangkung.png'
  },
  {
    id: 45, // Tambahkan ID
    name: 'kentang balado',
    calories: 51,
    unit: '1 porsi',
    imageUrl: '/images/kentang_balado.png'
  },
  {
    id: 46, // Tambahkan ID
    name: 'kentang goreng (frech fried)',
    calories: 192,
    unit: '1 porsi',
    imageUrl: '/images/kentang_goreng.png'
  },
  {
    id: 47, // Tambahkan ID
    name: 'keripik kentang',
    calories: 153,
    unit: '1 porsi',
    imageUrl: '/images/keripik_kentang.png'
  },
  {
    id: 48, // Tambahkan ID
    name: 'kerupuk',
    calories: 15,
    unit: '1 buah',
    imageUrl: '/images/kerupuk.png'
  },
  {
    id: 49, // Tambahkan ID
    name: 'kikil',
    calories: 80,
    unit: '1 tusuk',
    imageUrl: '/images/kikil.png'
  },
  {
    id: 50, // Tambahkan ID
    name: 'kopi hitam',
    calories: 2,
    unit: '1 gelas',
    imageUrl: '/images/kopi_hitam.png'
  },
  {
    id: 51, // Tambahkan ID
    name: 'kopi latte',
    calories: 135,
    unit: '1 gelas',
    imageUrl: '/images/kopi_latte.png'
  },
  {
    id: 52, // Tambahkan ID
    name: 'kurma',
    calories: 23,
    unit: '1 buah',
    imageUrl: '/images/kurma.png'
  },
  {
    id: 53, // Tambahkan ID
    name: 'macaroni keju',
    calories: 203,
    unit: '1 porsi',
    imageUrl: '/images/macaroni_keju.png'
  },
  {
    id: 54, // Tambahkan ID
    name: 'mangga',
    calories: 135,
    unit: '1 buahh',
    imageUrl: '/images/mangga.png'
  },
  {
    id: 55, // Tambahkan ID
    name: 'melon',
    calories: 60,
    unit: '1 porsi',
    imageUrl: '/images/melon.png'
  },
  {
    id: 56, // Tambahkan ID
    name: 'nanas',
    calories: 74,
    unit: '1 porsi',
    imageUrl: '/images/nanas.png'
  },
  {
    id: 57, // Tambahkan ID
    name: 'nasi',
    calories: 129,
    unit: '1 porsi',
    imageUrl: '/images/nasi.png'
  },
  {
    id: 58, // Tambahkan ID
    name: 'nasi goreng',
    calories: 250,
    unit: '1 porsi',
    imageUrl: '/images/nasi_goreng.png'
  },
  {
    id: 59, // Tambahkan ID
    name: 'nasi merah',
    calories: 110,
    unit: '1 porsi',
    imageUrl: '/images/nasi_merah.png'
  },
  {
    id: 60, // Tambahkan ID
    name: 'oatmeal',
    calories: 97,
    unit: '1 porsi',
    imageUrl: '/images/oatmeal.png'
  },
  {
    id: 61, // Tambahkan ID
    name: 'paha ayam',
    calories: 245,
    unit: '1 porsi',
    imageUrl: '/images/paha_ayam.png'
  },
  {
    id: 62, // Tambahkan ID
    name: 'paha ayam bakar',
    calories: 152,
    unit: '1 porsi',
    imageUrl: '/images/paha_ayam_bakar.png'
  },
  {
    id: 63, // Tambahkan ID
    name: 'paha ayam goreng',
    calories: 243,
    unit: '1 porsi',
    imageUrl: '/images/paha_ayam_goreng.png'
  },
  {
    id: 64, // Tambahkan ID
    name: 'papaya',
    calories: 55,
    unit: '1 porsi',
    imageUrl: '/images/papaya.png'
  },
  {
    id: 65, // Tambahkan ID
    name: 'perkedel',
    calories: 21,
    unit: '1 buah',
    imageUrl: '/images/perkedel.png'
  },
  {
    id: 66,
    name: 'pir',
    calories: 96,
    unit: '1 buah',
    imageUrl: '/images/pir.png'
  },
  {
    id: 67, // Tambahkan ID
    name: 'pizza',
    calories: 256,
    unit: '1 buah',
    imageUrl: '/images/pizza.png'
  },
  {
    id: 68, // Tambahkan ID
    name: 'pudding',
    calories: 157,
    unit: '1 porsi',
    imageUrl: '/images/pudding.png'
  },
  {
    id: 69, // Tambahkan ID
    name: 'rendang',
    calories: 193,
    unit: '1 porsi',
    imageUrl: '/images/rendang.png'
  },
  {
    id: 70, // Tambahkan ID
    name: 'roti gandum',
    calories: 67,
    unit: '1 buah',
    imageUrl: '/images/roti_gandum.png'
  },
  {
    id: 71, // Tambahkan ID
    name: 'roti putih',
    calories: 66,
    unit: '1 buah',
    imageUrl: '/images/roti_putih.png'
  },
  {
    id: 72, // Tambahkan ID
    name: 'salad',
    calories: 9,
    unit: '1 porsi',
    imageUrl: '/images/salad.png'
  },
  {
    id: 73, // Tambahkan ID
    name: 'sate ati ampela',
    calories: 32,
    unit: '1 tusuk',
    imageUrl: '/images/sate_ati_ampela.png'
  },
  {
    id: 74, // Tambahkan ID
    name: 'sate ayam',
    calories: 34,
    unit: '1 tusuk',
    imageUrl: '/images/sate_ayam.png'
  },
  {
    id: 75, // Tambahkan ID
    name: 'sate kambing',
    calories: 32,
    unit: '1 tusuk',
    imageUrl: '/images/sate_kambing.png'
  },
  {
    id: 76, // Tambahkan ID
    name: 'sate maranggi',
    calories: 38,
    unit: '1 tusuk',
    imageUrl: '/images/sate_maranggi.png'
  },
  {
    id: 77, // Tambahkan ID
    name: 'sate padang',
    calories: 24,
    unit: '1 tusuk',
    imageUrl: '/images/sate_padang.png'
  },
  {
    id: 78, // Tambahkan ID
    name: 'sate taichan',
    calories: 36,
    unit: '1 tusuk',
    imageUrl: '/images/sate_taichan.png'
  },
  {
    id: 79, // Tambahkan ID
    name: 'sate usus',
    calories: 21,
    unit: '1 tusuk',
    imageUrl: '/images/sate_usus.png'
  },
  {
    id: 80, // Tambahkan ID
    name: 'sayap ayam bakar',
    calories: 160,
    unit: '1 porsi',
    imageUrl: '/images/sayap_ayam_bakar.png'
  },
  {
    id: 81, // Tambahkan ID
    name: 'sayap ayam goreng',
    calories: 160,
    unit: '1 porsi',
    imageUrl: '/images/sayap_ayam_goreng.png'
  },
  {
    id: 82, // Tambahkan ID
    name: 'sayur asem',
    calories: 80,
    unit: '1 porsi',
    imageUrl: '/images/sayur_asem.png'
  },
  {
    id: 83, // Tambahkan ID
    name: 'sayur labu',
    calories: 58,
    unit: '1 porsi',
    imageUrl: '/images/sayur_labu.png'
  },
  {
    id: 84, // Tambahkan ID
    name: 'sayur lodeh',
    calories: 162,
    unit: '1 porsi',
    imageUrl: '/images/sayur_lodeh.png'
  },
  {
    id: 85, // Tambahkan ID
    name: 'sayur Nangka',
    calories: 57,
    unit: '1 porsi',
    imageUrl: '/images/sayur_nangka.png'
  },
  {
    id: 86, // Tambahkan ID
    name: 'sayur sop',
    calories: 60,
    unit: '1 porsi',
    imageUrl: '/images/sayur_sop.png'
  },
  {
    id: 87, // Tambahkan ID
    name: 'semangka',
    calories: 46,
    unit: '1 porsi',
    imageUrl: '/images/semangka.png'
  },
  {
    id: 88, // Tambahkan ID
    name: 'sosis ayam',
    calories: 49,
    unit: '1 buah',
    imageUrl: '/images/sosis_ayam.png'
  },
  {
    id: 89, // Tambahkan ID
    name: 'sosis sapi',
    calories: 42,
    unit: '1 buah',
    imageUrl: '/images/sosis_sapi.png'
  },
  {
    id: 90, // Tambahkan ID
    name: 'soto ayam',
    calories: 312,
    unit: '1 porsi',
    imageUrl: '/images/soto_ayam.png'
  },
  {
    id: 91, // Tambahkan ID
    name: 'soto daging',
    calories: 219,
    unit: '1 porsi',
    imageUrl: '/images/soto_daging.png'
  },
  {
    id: 92, // Tambahkan ID
    name: 'soto mie',
    calories: 370,
    unit: '1 porsi',
    imageUrl: '/images/soto_mie.png'
  },
  {
    id: 93, // Tambahkan ID
    name: 'spageti wow',
    calories: 360,
    unit: '1 bungkus',
    imageUrl: '/images/spageti_wow.png'
  },
  {
    id: 94, // Tambahkan ID
    name: 'tahu goreng',
    calories: 35,
    unit: '1 buah',
    imageUrl: '/images/tahu_goreng.png'
  },
  {
    id: 95, // Tambahkan ID
    name: 'tauge',
    calories: 29,
    unit: '1 porsi',
    imageUrl: '/images/tauge.png'
  },
  {
    id: 96, // Tambahkan ID
    name: 'teh manis',
    calories: 55,
    unit: '1 gelas',
    imageUrl: '/images/teh_manis.png'
  },
  {
    id: 97, // Tambahkan ID
    name: 'teh tawar',
    calories: 2,
    unit: '1 gelas',
    imageUrl: '/images/teh_tawar.png'
  },
  {
    id: 98, // Tambahkan ID
    name: 'telur ceplok',
    calories: 92,
    unit: '1 porsi',
    imageUrl: '/images/telur_ceplok.png'
  },
  {
    id: 99, // Tambahkan ID
    name: 'telur dadar',
    calories: 93,
    unit: '1 buah',
    imageUrl: '/images/telur_dadar.png'
  },
  {
    id: 100, // Tambahkan ID
    name: 'telur rebus',
    calories: 68,
    unit: '1 butir',
    imageUrl: '/images/telur_rebus.png'
  },
  {
    id: 101, // Tambahkan ID
    name: 'tempe',
    calories: 175,
    unit: '1 buah',
    imageUrl: '/images/tempe.png'
  },
  {
    id: 102, // Tambahkan ID
    name: 'tempe goreng',
    calories: 34,
    unit: '1 buah',
    imageUrl: '/images/tempe_goreng.png'
  },
  {
    id: 103, // Tambahkan ID
    name: 'tomat',
    calories: 22,
    unit: '1 buah',
    imageUrl: '/images/tomat.png'
  },
  {
    id: 104,
    name: 'udang',
    calories: 9,
    unit: '1 buah',
    imageUrl: '/images/udang.png'
  },
  {
    id: 105, // Tambahkan ID
    name: 'udang',
    calories: 122,
    unit: '1 porsi',
    imageUrl: '/images/udang_porsi.png'
  },
  {
    id: 106, // Tambahkan ID
    name: 'udang goreng tepung',
    calories: 245,
    unit: '1 porsi',
    imageUrl: '/images/udang_goreng_tepung.png'
  },
  {
    id: 107,
    name: 'usus',
    calories: 94,
    unit: '1 porsi',
    imageUrl: '/images/usus.png'
  },
  {
    id: 108, // Tambahkan ID
    name: 'wafer coklat',
    calories: 26,
    unit: '1 buah',
    imageUrl: '/images/wafer_coklat.png'
  },
  {
    id: 109, // Tambahkan ID
    name: 'wortel',
    calories: 41,
    unit: '1 porsi',
    imageUrl: '/images/wortel.png'
  },
  {
    id: 110, // Tambahkan ID
    name: 'nasi',
    calories: 65,
    unit: '1/2 porsi',
    imageUrl: '/images/nasi.png'
  },
  {
    id: 111, // Tambahkan ID
    name: 'nasi merah',
    calories: 55,
    unit: '1/2 porsi',
    imageUrl: '/images/nasi_merah.png'
  }
];

export const getAllFoods = () => {
  return foodData;
};

export const searchFoodsByName = (query) => {
  const processedQuery = String(query || '');

  // Jika setelah diproses, query string menjadi kosong, kembalikan semua makanan
  if (processedQuery.length === 0) {
    return foodData; // Mengembalikan semua makanan jika query kosong
  }

  // Sekarang 'processedQuery' dijamin adalah string
  const lowerCaseQuery = processedQuery.toLowerCase();

  // Filter makanan yang namanya mengandung query (case-insensitive)
  return foodData.filter(
    (food) =>
      // Tambahkan juga pemeriksaan defensif untuk food.name,
      // memastikan food.name ada dan bertipe string sebelum memanggil toLowerCase.
      food.name &&
      typeof food.name === 'string' &&
      food.name.toLowerCase().includes(lowerCaseQuery)
  );
};

export const getFoodByName = (name) => {
  return foodData.find(
    (food) => food.name.toLowerCase() === name.toLowerCase()
  );
};

export const calculateTotalCalories = (selectedFoods) => {
  return selectedFoods.reduce((total, food) => {
    // If it's a custom food, use its calories directly
    if (food.isCustom) {
      return total + food.calories * (food.quantity || 1);
    }

    // For standard foods, look up in foodData
    const foodData = getFoodByName(food.name);
    if (!foodData) return total;
    return total + foodData.calories * (food.quantity || 1);
  }, 0);
};

export const calculateRemainingCalories = (tdee, selectedFoods) => {
  const totalCalories = calculateTotalCalories(selectedFoods);
  return tdee - totalCalories;
};

// Helper function to get food details
export const getFoodDetails = (foodName) => {
  return getFoodByName(foodName);
};
