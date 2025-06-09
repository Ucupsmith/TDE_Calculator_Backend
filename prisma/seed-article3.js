import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const article3Data = {
  title: "Aktivitas Fisik dan TDEE: Mengoptimalkan Pengeluaran Energi",
  content: `
<p>Aktivitas fisik memainkan peran penting dalam menentukan Total Daily Energy Expenditure (TDEE) Anda. Memahami bagaimana berbagai jenis aktivitas mempengaruhi pengeluaran energi dapat membantu Anda mengoptimalkan rutinitas olahraga dan mencapai tujuan kesehatan dengan lebih efektif.</p>

<h2>Komponen Aktivitas Fisik dalam TDEE</h2>
<div>
  <div>
    <h3>Exercise Activity Thermogenesis (EAT)</h3>
    <ul>
      <li>Olahraga terstruktur dan terencana</li>
      <li>Mencakup 15-30% dari total pengeluaran energi</li>
      <li>Dapat dimodifikasi secara signifikan</li>
      <li>Termasuk latihan kardio dan kekuatan</li>
    </ul>
  </div>

  <div>
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
<div>
  <div>
    <h3>Latihan Kardio</h3>
    <ul>
      <li>Lari: 600-800 kalori/jam</li>
      <li>Bersepeda: 400-600 kalori/jam</li>
      <li>Berenang: 400-700 kalori/jam</li>
      <li>HIIT: 500-800 kalori/jam</li>
      <li>Berjalan: 200-400 kalori/jam</li>
    </ul>
  </div>

  <div>
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
<div>
  <div>
    <h3>Faktor Individu</h3>
    <ul>
      <li>Berat badan dan komposisi tubuh</li>
      <li>Tingkat kebugaran</li>
      <li>Efisiensi gerakan</li>
      <li>Usia dan jenis kelamin</li>
      <li>Kondisi kesehatan</li>
    </ul>
  </div>

  <div>
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
<div>
  <div>
    <h3>Meningkatkan NEAT</h3>
    <ul>
      <li>Gunakan standing desk</li>
      <li>Parkir lebih jauh</li>
      <li>Naik tangga daripada lift</li>
      <li>Berjalan saat istirahat</li>
      <li>Lakukan stretching rutin</li>
    </ul>
  </div>

  <div>
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
<div>
  <div>
    <h3>Alat Monitoring</h3>
    <ul>
      <li>Fitness tracker</li>
      <li>Heart rate monitor</li>
      <li>Smartphone apps</li>
      <li>Activity log</li>
      <li>Progress photos</li>
    </ul>
  </div>

  <div>
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
`,
  image_path: "/images/articleImages/tdee3.jpg",
  category: "TDEE Calculation"
};

async function main() {
  try {
    // Update article 3
    const updatedArticle = await prisma.article.update({
      where: {
        article_id: 3
      },
      data: article3Data
    });
    console.log('Article 3 updated successfully:', updatedArticle);
  } catch (error) {
    console.error('Error updating article:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 