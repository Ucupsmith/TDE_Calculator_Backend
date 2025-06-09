const articles = {
    article1: {
        id: 1,
        title: "Memahami TDEE: Kunci Mengelola Kebutuhan Kalori Harian Anda",
        content: `<div class='space-y-6 pb-20'>
            <p>Total Daily Energy Expenditure (TDEE) adalah konsep fundamental dalam nutrisi dan kebugaran yang menentukan jumlah total kalori yang dibakar tubuh Anda dalam sehari. Memahami TDEE tidak hanya penting untuk manajemen berat badan, tetapi juga merupakan kunci untuk mengoptimalkan performa fisik, pemulihan, dan kesehatan secara keseluruhan.</p>
            <h2>Komponen Utama TDEE</h2>
            <ul>
                <li><b>Basal Metabolic Rate (BMR):</b> Mencakup 60-75% dari total pengeluaran energi, energi yang dibutuhkan untuk fungsi vital tubuh.</li>
                <li><b>Aktivitas Fisik:</b> Mencakup 15-30% dari total pengeluaran energi, termasuk olahraga terstruktur dan aktivitas sehari-hari.</li>
                <li><b>Thermic Effect of Food (TEF):</b> Mencakup 5-10% dari total pengeluaran energi, energi yang dibutuhkan untuk mencerna dan memproses makanan.</li>
            </ul>
            <h2>Faktor yang Mempengaruhi TDEE</h2>
            <ul>
                <li>Usia dan jenis kelamin</li>
                <li>Komposisi tubuh (rasio otot-lemak)</li>
                <li>Hormon dan metabolisme</li>
                <li>Kondisi kesehatan</li>
            </ul>
            <h2>Kesimpulan</h2>
            <p>Memahami TDEE adalah langkah fundamental dalam perjalanan kesehatan dan kebugaran Anda. Dengan pengetahuan yang tepat tentang kebutuhan kalori harian, Anda dapat membuat keputusan yang lebih baik terkait nutrisi dan aktivitas fisik.</p>
        </div>`,
        image_path: "/images/articles/tdee1.png",
        author: {
            name: "Ahmad Fitrianto",
            profile_image: "/images/authors/ahmad.jpg"
        },
        created_at: "2024-06-07T00:00:00.000Z",
        views: 0,
        likes: 0,
        meta_description: "Penjelasan TDEE dan pentingnya untuk manajemen kalori harian.",
        meta_keywords: "tdee, kalori, nutrisi, kesehatan",
        reading_time: 7,
        related_ids: [2, 3]
    },
    article2: {
        id: 2,
        title: "Komponen-Komponen TDEE yang Wajib Diketahui",
        content: `<div><p>TDEE terdiri dari BMR, aktivitas fisik, dan efek termik makanan. Pelajari cara menghitungnya untuk kebutuhan kalori harian Anda.</p></div>`,
        image_path: "/images/articles/tdee2.png",
        author: {
            name: "Siti Nurhaliza",
            profile_image: "/images/authors/siti.jpg"
        },
        created_at: "2024-06-06T00:00:00.000Z",
        views: 0,
        likes: 0,
        meta_description: "Komponen utama TDEE dan cara menghitungnya.",
        meta_keywords: "tdee, komponen, bmr, aktivitas fisik",
        reading_time: 4,
        related_ids: [1, 3]
    },
    article3: {
        id: 3,
        title: "Cara Praktis Menghitung TDEE",
        content: `<div class="space-y-6 pb-20">
          <p>Aktivitas fisik memainkan peran penting dalam menentukan Total Daily Energy Expenditure (TDEE) Anda. Memahami bagaimana berbagai jenis aktivitas mempengaruhi pengeluaran energi dapat membantu Anda mengoptimalkan rutinitas olahraga dan mencapai tujuan kesehatan dengan lebih efektif.</p>

          <h2>Komponen Aktivitas Fisik dalam TDEE</h2>
          <div class="space-y-4">
            <div class="p-4 rounded-lg">
              <h3>Exercise Activity Thermogenesis (EAT)</h3>
              <ul>
                <li>Olahraga terstruktur dan terencana</li>
                <li>Mencakup 15-30% dari total pengeluaran energi</li>
                <li>Dapat dimodifikasi secara signifikan</li>
                <li>Termasuk latihan kardio dan kekuatan</li>
              </ul>
            </div>

            <div class="p-4 rounded-lg">
              <h3>Non-Exercise Activity Thermogenesis (NEAT)</h3>
              <ul>
                <li>Aktivitas sehari-hari non-olahraga</li>
                <li>Mencakup 15-50% dari total pengeluaran energi</li>
                <li>Termasuk berjalan, berdiri, dan gerakan spontan</li>
                <li>Berbeda signifikan antar individu</li>
              </ul>
            </div>
          </div>

          <h2>Jenis Aktivitas Fisik dan Pengaruhnya</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-lg">
              <h3>Latihan Kardio</h3>
              <ul>
                <li>Lari: 600-800 kalori/jam</li>
                <li>Bersepeda: 400-600 kalori/jam</li>
                <li>Berenang: 400-700 kalori/jam</li>
                <li>HIIT: 500-800 kalori/jam</li>
                <li>Berjalan: 200-400 kalori/jam</li>
              </ul>
            </div>

            <div class="p-4 rounded-lg">
              <h3>Latihan Kekuatan</h3>
              <ul>
                <li>Angkat beban: 300-500 kalori/jam</li>
                <li>CrossFit: 500-700 kalori/jam</li>
                <li>Bodyweight training: 200-400 kalori/jam</li>
                <li>Circuit training: 400-600 kalori/jam</li>
                <li>Yoga/Pilates: 200-400 kalori/jam</li>
              </ul>
            </div>
          </div>

          <h2>Faktor yang Mempengaruhi Pengeluaran Energi</h2>
          <div class="space-y-4">
            <div class="p-4 rounded-lg">
              <h3>Faktor Individu</h3>
              <ul>
                <li>Berat badan dan komposisi tubuh</li>
                <li>Tingkat kebugaran</li>
                <li>Efisiensi gerakan</li>
                <li>Usia dan jenis kelamin</li>
                <li>Kondisi kesehatan</li>
              </ul>
            </div>

            <div class="p-4 rounded-lg">
              <h3>Faktor Aktivitas</h3>
              <ul>
                <li>Intensitas dan durasi</li>
                <li>Jenis aktivitas</li>
                <li>Frekuensi latihan</li>
                <li>Volume total</li>
                <li>Istirahat dan pemulihan</li>
              </ul>
            </div>
          </div>

          <h2>Strategi Optimasi</h2>
          <div class="space-y-4">
            <div class="p-4 rounded-lg">
              <h3>Meningkatkan NEAT</h3>
              <ul>
                <li>Gunakan standing desk</li>
                <li>Parkir lebih jauh</li>
                <li>Naik tangga daripada lift</li>
                <li>Berjalan saat istirahat</li>
                <li>Lakukan stretching rutin</li>
              </ul>
            </div>

            <div class="p-4 rounded-lg">
              <h3>Program Latihan Efektif</h3>
              <ul>
                <li>Kombinasi kardio dan kekuatan</li>
                <li>HIIT untuk efisiensi waktu</li>
                <li>Progressive overload</li>
                <li>Variasi latihan</li>
                <li>Pemulihan yang cukup</li>
              </ul>
            </div>
          </div>

          <h2>Monitoring dan Penyesuaian</h2>
          <div class="space-y-4">
            <div class="p-4 rounded-lg">
              <h3>Alat Monitoring</h3>
              <ul>
                <li>Fitness tracker</li>
                <li>Heart rate monitor</li>
                <li>Smartphone apps</li>
                <li>Activity log</li>
                <li>Progress photos</li>
              </ul>
            </div>

            <div class="p-4 rounded-lg">
              <h3>Penyesuaian Program</h3>
              <ul>
                <li>Evaluasi mingguan</li>
                <li>Modifikasi intensitas</li>
                <li>Perubahan volume latihan</li>
                <li>Rotasi jenis aktivitas</li>
                <li>Penyesuaian nutrisi</li>
              </ul>
            </div>
          </div>

          <h2>Kesimpulan</h2>
          <p>Aktivitas fisik adalah komponen penting dalam TDEE yang dapat dimodifikasi untuk mencapai tujuan kesehatan Anda. Dengan memahami berbagai jenis aktivitas dan pengaruhnya terhadap pengeluaran energi, Anda dapat membuat program latihan yang lebih efektif dan berkelanjutan. Ingat untuk selalu mempertimbangkan keseimbangan antara intensitas, volume, dan pemulihan untuk hasil yang optimal.</p>
        </div>`,
        image_path: "/images/articles/tdee3.png",
        author: {
            name: "Budi Santoso",
            profile_image: "/images/authors/budi.jpg"
        },
        created_at: "2024-06-05T00:00:00.000Z",
        views: 0,
        likes: 0,
        meta_description: "Panduan praktis menghitung TDEE.",
        meta_keywords: "tdee, menghitung, panduan",
        reading_time: 3,
        related_ids: [1, 2]
    },
    article4: {
        id: 4,
        title: "TDEE and Weight Management",
        content: `Understanding TDEE is crucial for effective weight management:

Weight Loss
- Create a caloric deficit
- Aim for 500-1000 calorie deficit
- Monitor progress weekly
- Adjust as needed

Weight Gain
- Create a caloric surplus
- Aim for 300-500 calorie surplus
- Focus on muscle gain
- Monitor body composition

Maintenance
- Match calories to TDEE
- Monitor weight trends
- Adjust for activity changes
- Consider seasonal variations

Key Tips:
- Track your progress
- Be patient with changes
- Stay consistent
- Adjust based on results`,
        image: "/images/articles/tdee-weight-management.jpg",
        category: "Weight Management",
        date: "2024-03-20"
    },
    article5: {
        id: 5,
        title: "Common TDEE Calculation Mistakes",
        content: `Avoid these common mistakes when calculating your TDEE:

1. Overestimating Activity Level
- Be honest about your activity
- Consider daily movement
- Don't include wishful thinking

2. Ignoring Body Composition
- Muscle burns more calories
- Consider your body fat percentage
- Adjust for muscle mass

3. Not Accounting for Age
- Metabolism slows with age
- Adjust calculations accordingly
- Consider hormonal changes

4. Forgetting About NEAT
- Include daily activities
- Consider job requirements
- Account for lifestyle factors

5. Not Recalculating
- Update regularly
- Adjust for weight changes
- Consider lifestyle changes`,
        image: "/images/articles/tdee-mistakes.jpg",
        category: "Tips",
        date: "2024-03-20"
    }
};

// Function to get all articles
export const getAllArticles = () => {
    return Object.values(articles);
};

// Function to get article by ID
export const getArticleById = (id) => {
    return articles[`article${id}`];
};

// Function to get articles by category
export const getArticlesByCategory = (category) => {
    return Object.values(articles).filter(article => article.category === category);
};

export default articles; 