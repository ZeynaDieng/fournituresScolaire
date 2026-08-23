// server/api/airtable/testimonials.get.ts

const cachedTestimonialsResult = {
  success: true,
  data: [
    {
      id: "fallback-1",
      name: "Awa Diop",
      role: "Maman d'élève en CM2",
      avatar: "https://i.pravatar.cc/150?img=1",
      text: "Un service incroyable ! J'ai commandé le pack scolaire complet pour mon fils et tout était parfait. La livraison a été rapide et les fournitures sont de très bonne qualité. Fini le stress de la rentrée !",
      rating: 5,
      location: "Dakar",
      isActive: true,
      createdTime: new Date().toISOString(),
      order: 1,
    },
    {
      id: "fallback-2",
      name: "Moussa Fall",
      role: "Papa de deux collégiens",
      avatar: "https://i.pravatar.cc/150?img=2",
      text: "Je recommande vivement. Le site est facile à utiliser et les packs sont très bien pensés. Un gain de temps énorme pour les parents. Les prix sont très compétitifs !",
      rating: 5,
      location: "Thiès",
      isActive: true,
      createdTime: new Date().toISOString(),
      order: 2,
    },
    {
      id: "fallback-3",
      name: "Fatima Ndiaye",
      role: "Enseignante en primaire",
      avatar: "https://i.pravatar.cc/150?img=3",
      text: "Enfin une solution simple et efficace pour les fournitures scolaires au Sénégal. La qualité est au rendez-vous. Je le conseille à tous les parents de mes élèves.",
      rating: 5,
      location: "Saint-Louis",
      isActive: true,
      createdTime: new Date().toISOString(),
      order: 3,
    },
    {
      id: "fallback-4",
      name: "Omar Ba",
      role: "Directeur d'école",
      avatar: "https://i.pravatar.cc/150?img=4",
      text: "Nous avons fait appel à leurs services pour équiper notre école. Service professionnel, livraison respectée et qualité au rendez-vous. Parfait pour les établissements !",
      rating: 4,
      location: "Kaolack",
      isActive: true,
      createdTime: new Date().toISOString(),
      order: 4,
    },
    {
      id: "fallback-5",
      name: "Aissatou Diouf",
      role: "Maman de 3 enfants",
      avatar: "https://i.pravatar.cc/150?img=5",
      text: "EduShop m'a sauvé la rentrée ! Plus besoin de courir dans toute la ville sous la chaleur. Mes 3 enfants ont eu leurs fournitures complètes à temps.",
      rating: 5,
      location: "Dakar",
      isActive: true,
      createdTime: new Date().toISOString(),
      order: 5,
    },
  ],
  total: 5,
  source: "local-fallback",
};

export default defineEventHandler(async (event) => {
  return cachedTestimonialsResult;
});
