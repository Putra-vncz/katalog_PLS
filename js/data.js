// ============================================
// E-KATALOG PLS UNPATTI — Default Data
// ============================================

const DEFAULT_DATA = {
  hero: {
    title: 'Jalur Karier Lulusan PLS',
    subtitle: 'Panduan Masa Depan Lulusan Prodi Pendidikan Luar Sekolah FKIP UNPATTI',
    badge: 'Career Path & Alumni Success',
  },

  kataPengantar: {
    quote: 'E-Katalog ini adalah kompas untuk membantu alumni merancang masa depan. Kami percaya setiap lulusan PLS memiliki potensi besar untuk menjadi agen perubahan di masyarakat, khususnya di wilayah kepulauan Maluku yang kita cintai.',
    authorName: 'Dr. Lamberthus J. Lokollo, M.Pd',
    authorTitle: 'Ketua Program Studi Pendidikan Luar Sekolah, FKIP UNPATTI',
    authorImage: 'assets/images/kaprodi.jpg',
  },

  profilProdi: {
    visi: 'Menjadi Program Studi yang unggul dalam menghasilkan tenaga profesional di bidang Pendidikan Luar Sekolah yang mampu mengembangkan SDM dan memberdayakan masyarakat, khususnya di wilayah kepulauan.',
    misi: [
      'Menyelenggarakan pendidikan dan pengajaran yang bermutu di bidang PLS',
      'Melaksanakan penelitian yang inovatif dan relevan dengan kebutuhan masyarakat',
      'Melaksanakan pengabdian kepada masyarakat yang berdampak pada pemberdayaan',
      'Membangun kerjasama dengan berbagai pihak untuk pengembangan PLS',
    ],
    kompetensi: [
      { icon: '🏫', name: 'Pendidik Nonformal', desc: 'Mampu merancang dan mengelola program pendidikan nonformal' },
      { icon: '🤝', name: 'Fasilitator Pemberdayaan', desc: 'Terampil mendampingi masyarakat menuju kemandirian' },
      { icon: '📋', name: 'Perancang Program Pelatihan', desc: 'Ahli menyusun kurikulum dan modul pelatihan' },
      { icon: '🌐', name: 'Agen Perubahan Sosial', desc: 'Penggerak transformasi sosial di komunitas' },
    ],
  },

  karierSectors: [
    {
      id: 'gov',
      title: 'Sektor Pendidikan Formal & Pemerintahan',
      icon: '🏛️',
      theme: 'gov',
      jobs: [
        {
          title: 'Pamong Belajar',
          desc: 'Tenaga pendidik pada satuan pendidikan nonformal (SKB/BPKB) yang bertugas menyusun kurikulum dan melakukan pengkajian program pendidikan.',
          institutions: ['Kemendikbudristek', 'Dinas Pendidikan'],
        },
        {
          title: 'Penilik',
          desc: 'Tenaga kependidikan yang bertugas melakukan pengendalian mutu dan evaluasi program pendidikan nonformal dan informal.',
          institutions: ['Dinas Pendidikan', 'BKKBN'],
        },
        {
          title: 'Analis Kebijakan Pendidikan',
          desc: 'Bekerja di instansi pemerintah untuk merancang kebijakan program pendidikan masyarakat.',
          institutions: ['Kemendikbudristek', 'Kemendesa'],
        },
      ],
    },
    {
      id: 'ngo',
      title: 'Sektor Pemberdayaan Masyarakat (NGO/LSM)',
      icon: '🤝',
      theme: 'ngo',
      jobs: [
        {
          title: 'Fasilitator Pemberdayaan',
          desc: 'Mendampingi masyarakat desa atau komunitas marginal untuk mandiri secara ekonomi dan sosial.',
          institutions: ['UNICEF', 'UNESCO'],
        },
        {
          title: 'Community Development Officer (CDO)',
          desc: 'Merancang program tanggung jawab sosial perusahaan (CSR) yang berdampak bagi warga sekitar.',
          institutions: ['Dompet Dhuafa', 'LSM Lokal Maluku'],
        },
        {
          title: 'Pendamping Program Sosial',
          desc: 'Menjadi jembatan antara program pemerintah pusat (PKH, Fasdes) dengan masyarakat sasaran.',
          institutions: ['Kemensos', 'Kemendesa'],
        },
      ],
    },
    {
      id: 'corp',
      title: 'Sektor Pelatihan & Corporate',
      icon: '💼',
      theme: 'corp',
      jobs: [
        {
          title: 'Instructional Designer',
          desc: 'Merancang modul pembelajaran atau kurikulum pelatihan yang efektif di dunia kerja.',
          institutions: ['LKP', 'BLK'],
        },
        {
          title: 'Corporate Trainer / L&D Specialist',
          desc: 'Mengelola pengembangan kompetensi karyawan di perusahaan swasta.',
          institutions: ['Perusahaan Swasta (HRD/L&D)'],
        },
        {
          title: 'Pengelola LKP',
          desc: 'Mengelola operasional lembaga kursus dan pelatihan (bahasa, komputer, keterampilan).',
          institutions: ['Lembaga Kursus & Pelatihan'],
        },
      ],
    },
    {
      id: 'entre',
      title: 'Sektor Wirausaha & Kreatif Digital',
      icon: '🚀',
      theme: 'entre',
      jobs: [
        {
          title: 'Edutech Content Creator',
          desc: 'Membangun platform pendidikan berbasis digital atau media pembelajaran kreatif.',
          institutions: [],
        },
        {
          title: 'Konsultan Pendidikan',
          desc: 'Memberikan jasa konsultasi perancangan program pelatihan untuk instansi atau komunitas.',
          institutions: [],
        },
        {
          title: 'Pemilik SKB Mandiri',
          desc: 'Mendirikan dan mengelola pusat kegiatan belajar masyarakat secara mandiri.',
          institutions: [],
        },
      ],
    },
  ],

  skills: [
    { icon: '🗣', label: 'Communication & Facilitation' },
    { icon: '🗺', label: 'Social Mapping & Analysis' },
    { icon: '📊', label: 'Program Evaluation' },
    { icon: '👥', label: 'Leadership & Management' },
    { icon: '💻', label: 'Digital Literacy' },
    { icon: '📝', label: 'Curriculum Design' },
  ],

  alumni: [
    {
      id: 'alumni-1',
      name: 'Maria Souisa',
      year: '2018',
      job: 'Pamong Belajar',
      institution: 'SKB Kota Ambon',
      quote: 'Ilmu yang saya dapat di PLS UNPATTI sangat relevan dengan pekerjaan saya sehari-hari. Jangan pernah ragu memilih jurusan ini!',
      photo: '',
      linkedin: '#',
    },
    {
      id: 'alumni-2',
      name: 'James Pattikawa',
      year: '2017',
      job: 'Community Development Officer',
      institution: 'UNICEF Indonesia',
      quote: 'Pengalaman KKN dan fasilitasi selama kuliah menjadi modal utama saya berkarier di organisasi internasional.',
      photo: '',
      linkedin: '#',
    },
    {
      id: 'alumni-3',
      name: 'Sarah Latupeirissa',
      year: '2019',
      job: 'L&D Specialist',
      institution: 'PT. Bank Maluku Malut',
      quote: 'PLS mengajarkan saya cara memahami kebutuhan belajar orang dewasa — skill yang sangat dicari di dunia corporate.',
      photo: '',
      linkedin: '#',
    },
  ],

  panduanKarier: [
    {
      step: 1,
      icon: '📄',
      title: 'Susun CV yang Lolos Seleksi',
      desc: 'Tips menyusun CV yang dapat terbaca sistem ATS (Applicant Tracking System) perusahaan.',
      checklist: ['Format standar & rapi', 'Kata kunci relevan', 'Maksimal satu halaman'],
      visible: true,
    },
    {
      step: 2,
      icon: '💼',
      title: 'Bangun Portofolio Selama Kuliah',
      desc: 'Dokumentasikan setiap proyek, KKN, penelitian, dan kegiatan lapangan sebagai bukti kompetensi.',
      checklist: ['Laporan KKN', 'Modul pelatihan', 'Dokumentasi kegiatan fasilitasi'],
      visible: true,
    },
    {
      step: 3,
      icon: '🌐',
      title: 'Optimalkan LinkedIn & Jaringan',
      desc: 'Bangun personal branding digital sejak semester awal untuk memperluas peluang karier.',
      checklist: ['Foto profesional', 'Headline menarik', 'Bangun koneksi aktif'],
      visible: true,
    },
  ],

  kontak: {
    address: 'Program Studi PLS, FKIP Universitas Pattimura, Jl. Ir. M. Putuhena, Kampus Poka, Ambon, Maluku',
    email: 'pls@fkip.unpatti.ac.id',
    instagram: '@pls.unpatti',
    website: 'https://fkip.unpatti.ac.id',
    qrUrl: 'https://linktr.ee/pls.unpatti',
  },

  settings: {
    maintenanceMode: false,
    lastUpdated: new Date().toISOString(),
  },

  activityLog: [],
};
