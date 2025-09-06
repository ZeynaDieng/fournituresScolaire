// server/api/airtable/testimonials.get.ts
export default defineEventHandler(async (event) => {
  console.log(
    "🔄 Utilisation temporaire des données de fallback pour les témoignages..."
  );

  // Force l'utilisation des données de fallback temporairement
  const fallbackTestimonials = [
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
      text: "Gain de temps énorme ! Plus besoin de courir les magasins. Tout arrive à domicile et c'est moins cher. Site au top pour les mamans débordées comme moi !",
      rating: 5,
      location: "Rufisque",
      isActive: true,
      createdTime: new Date().toISOString(),
      order: 5,
    },
    {
      id: "fallback-6",
      name: "Ibrahima Dieng",
      role: "Étudiant en master",
      avatar: "https://i.pravatar.cc/150?img=6",
      text: "Parfait pour les étudiants ! Bons prix, large choix et livraison efficace. J'ai trouvé tout ce dont j'avais besoin pour mes cours. Le service client est réactif !",
      rating: 4,
      location: "Touba",
      isActive: true,
      createdTime: new Date().toISOString(),
      order: 6,
    },
  ];

  // Trier par ordre si spécifié
  const sortedTestimonials = fallbackTestimonials.sort((a: any, b: any) => {
    return a.order - b.order;
  });

  return {
    success: true,
    data: sortedTestimonials,
    total: sortedTestimonials.length,
    fallback: true,
    message: "Données de démonstration - Configuration Airtable en cours",
  };
});
