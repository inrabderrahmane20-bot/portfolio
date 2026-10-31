import type { Lang } from '@/lib/translations';

interface ServiceCopy {
  label: string;
  title: string;
  intro: string;
  projectsLink: string;
  servicesTitle: string;
  services: { title: string; description: string; technologies: string[] }[];
  faqTitle: string;
  questions: { question: string; answer: string }[];
  cta: string;
}

export const serviceCopy: Record<Lang | 'ar', ServiceCopy> = {
  en: {
    label: 'SERVICES',
    title: 'Web design and software engineering',
    intro:
      'Abderrahmane Charak is a state-certified software engineer and product designer based in Marrakech, Morocco. Devariam presents selected web, backend, mobile, and AI work for clients seeking a remote development partner.',
    projectsLink: 'View selected projects',
    servicesTitle: 'What I work on',
    services: [
      {
        title: 'Web platforms and interfaces',
        description:
          'Design and build responsive websites and web applications, from interface structure through implementation. The focus is on clear user journeys, maintainable code, and production-ready delivery.',
        technologies: ['React', 'Next.js', 'TypeScript'],
      },
      {
        title: 'Backend development and APIs',
        description:
          'Build server-side application logic, REST APIs, and data layers. This work supports business workflows that need reliable communication between a web interface and its application data.',
        technologies: ['Django', 'Flask', 'Node.js', 'REST'],
      },
      {
        title: 'Product design and UX systems',
        description:
          'Shape interface layouts and design systems in Figma, then carry those decisions into the product implementation so that interaction and visual design work together.',
        technologies: ['Figma', 'Design systems', 'Interaction design'],
      },
      {
        title: 'Applied AI and NLP',
        description:
          'Develop applied machine-learning features such as text classification, chatbot flows, and automation, grounded in documented project experience.',
        technologies: ['Python', 'TensorFlow', 'NLTK'],
      },
    ],
    faqTitle: 'Common questions',
    questions: [
      {
        question: 'Who is Abderrahmane Charak?',
        answer:
          'Abderrahmane Charak is a state-certified software engineer based in Marrakech, Morocco. His portfolio documents web, mobile, backend, product-design, and applied AI work.',
      },
      {
        question: 'What is Devariam?',
        answer:
          'Devariam is Abderrahmane Charak’s professional portfolio and point of contact for freelance web and software projects.',
      },
      {
        question: 'What services are available?',
        answer:
          'Current documented capabilities include web platforms and interfaces, backend development and REST APIs, product design and UX systems, and applied AI and natural language processing.',
      },
      {
        question: 'Can you build custom software or middleware?',
        answer:
          'The portfolio documents web applications, backend development, and REST API work. Middleware is not documented as a separate project; share your integration requirements to discuss whether the work is a fit.',
      },
      {
        question: 'Can you work with clients remotely?',
        answer:
          'Yes. Abderrahmane is based in Marrakech and is available for remote freelance projects internationally. Contact him to discuss your project scope and working requirements.',
      },
      {
        question: 'Can companies in Europe or the Gulf work with Devariam?',
        answer:
          'Remote projects can be discussed with clients in Europe, Saudi Arabia, Qatar, and the United Arab Emirates. Abderrahmane is based in Morocco and does not claim offices in those markets.',
      },
      {
        question: 'How do I discuss a project?',
        answer:
          'Use the contact page or email support@devariam.com. A short brief with your goals, desired deliverables, and timeline helps start the conversation.',
      },
    ],
    cta: 'Discuss a project',
  },
  fr: {
    label: 'SERVICES',
    title: 'Design web et ingénierie logicielle',
    intro:
      'Abderrahmane Charak est ingénieur d’État en informatique et designer produit, basé à Marrakech, au Maroc. Devariam présente ses réalisations en web, backend, mobile et IA pour les clients à la recherche d’un partenaire de développement à distance.',
    projectsLink: 'Voir les projets sélectionnés',
    servicesTitle: 'Domaines d’intervention',
    services: [
      {
        title: 'Plateformes et interfaces web',
        description:
          'Concevoir et développer des sites adaptatifs et des applications web, de la structure des interfaces à leur réalisation. L’objectif : des parcours clairs, un code maintenable et une mise en production soignée.',
        technologies: ['React', 'Next.js', 'TypeScript'],
      },
      {
        title: 'Backend et API',
        description:
          'Développer la logique serveur, des API REST et des couches de données pour prendre en charge les processus métier et relier les interfaces aux données de l’application.',
        technologies: ['Django', 'Flask', 'Node.js', 'REST'],
      },
      {
        title: 'Design produit et systèmes UX',
        description:
          'Concevoir des interfaces et systèmes de design dans Figma, puis appliquer ces choix au produit pour harmoniser expérience, interactions et rendu visuel.',
        technologies: ['Figma', 'Design systems', 'Design d’interaction'],
      },
      {
        title: 'IA appliquée et NLP',
        description:
          'Développer des fonctionnalités d’apprentissage automatique appliquées, comme la classification de texte, les parcours conversationnels et l’automatisation, en s’appuyant sur des projets documentés.',
        technologies: ['Python', 'TensorFlow', 'NLTK'],
      },
    ],
    faqTitle: 'Questions fréquentes',
    questions: [
      {
        question: 'Qui est Abderrahmane Charak ?',
        answer:
          'Abderrahmane Charak est ingénieur d’État en informatique et vit à Marrakech, au Maroc. Son portfolio présente des projets web, mobile, backend, de design produit et d’IA appliquée.',
      },
      {
        question: 'Qu’est-ce que Devariam ?',
        answer:
          'Devariam est le portfolio professionnel d’Abderrahmane Charak et son point de contact pour les projets freelance en web et logiciel.',
      },
      {
        question: 'Quels services propose-t-il ?',
        answer:
          'Ses compétences documentées couvrent les plateformes et interfaces web, le backend et les API REST, le design produit et les systèmes UX, ainsi que l’IA appliquée et le traitement automatique du langage.',
      },
      {
        question: 'Peut-il développer un logiciel sur mesure ou du middleware ?',
        answer:
          'Le portfolio présente des applications web, du développement backend et des API REST. Le middleware n’y est pas documenté comme projet distinct ; contactez-le avec votre besoin d’intégration pour en discuter.',
      },
      {
        question: 'Peut-il travailler à distance ?',
        answer:
          'Oui. Basé à Marrakech, Abderrahmane est disponible pour des projets freelance à distance à l’international. Contactez-le pour discuter du périmètre et des modalités.',
      },
      {
        question: 'Les entreprises d’Europe ou du Golfe peuvent-elles travailler avec Devariam ?',
        answer:
          'Des projets à distance peuvent être discutés avec des clients en Europe, en Arabie saoudite, au Qatar et aux Émirats arabes unis. Abderrahmane est basé au Maroc et ne revendique pas de bureaux dans ces marchés.',
      },
      {
        question: 'Comment discuter d’un projet ?',
        answer:
          'Utilisez la page contact ou écrivez à support@devariam.com. Un bref descriptif des objectifs, des livrables souhaités et du calendrier permettra d’engager l’échange.',
      },
    ],
    cta: 'Discuter d’un projet',
  },
  es: {
    label: 'SERVICIOS',
    title: 'Diseño web e ingeniería de software',
    intro:
      'Abderrahmane Charak es ingeniero de software con título estatal y diseñador de producto, con base en Marrakech, Marruecos. Devariam presenta proyectos de web, backend, móvil e IA para clientes que buscan un colaborador de desarrollo remoto.',
    projectsLink: 'Ver proyectos seleccionados',
    servicesTitle: 'Áreas de trabajo',
    services: [
      {
        title: 'Plataformas e interfaces web',
        description:
          'Diseño y desarrollo de sitios web adaptables y aplicaciones web, desde la estructura de la interfaz hasta su implementación. El objetivo es ofrecer recorridos claros, código mantenible y una entrega lista para producción.',
        technologies: ['React', 'Next.js', 'TypeScript'],
      },
      {
        title: 'Desarrollo backend y API',
        description:
          'Desarrollo de lógica de servidor, API REST y capas de datos para respaldar flujos de negocio y conectar la interfaz web con los datos de la aplicación.',
        technologies: ['Django', 'Flask', 'Node.js', 'REST'],
      },
      {
        title: 'Diseño de producto y sistemas UX',
        description:
          'Diseño de interfaces y sistemas de diseño en Figma, trasladando esas decisiones al producto para coordinar la experiencia, las interacciones y el aspecto visual.',
        technologies: ['Figma', 'Sistemas de diseño', 'Diseño de interacción'],
      },
      {
        title: 'IA aplicada y NLP',
        description:
          'Desarrollo de funciones de aprendizaje automático aplicado, como clasificación de texto, flujos de chatbot y automatización, basadas en experiencia documentada.',
        technologies: ['Python', 'TensorFlow', 'NLTK'],
      },
    ],
    faqTitle: 'Preguntas frecuentes',
    questions: [
      {
        question: '¿Quién es Abderrahmane Charak?',
        answer:
          'Abderrahmane Charak es ingeniero de software con título estatal y vive en Marrakech, Marruecos. Su portfolio documenta proyectos web, móviles, backend, diseño de producto e IA aplicada.',
      },
      {
        question: '¿Qué es Devariam?',
        answer:
          'Devariam es el portfolio profesional de Abderrahmane Charak y el punto de contacto para proyectos freelance de desarrollo web y software.',
      },
      {
        question: '¿Qué servicios ofrece?',
        answer:
          'Sus capacidades documentadas incluyen plataformas e interfaces web, desarrollo backend y API REST, diseño de producto y sistemas UX, e IA aplicada y procesamiento del lenguaje natural.',
      },
      {
        question: '¿Puede desarrollar software a medida o middleware?',
        answer:
          'El portfolio documenta aplicaciones web, desarrollo backend y API REST. El middleware no aparece como proyecto independiente; comparte los requisitos de integración para conversar sobre su viabilidad.',
      },
      {
        question: '¿Puede trabajar con clientes a distancia?',
        answer:
          'Sí. Abderrahmane trabaja desde Marrakech y está disponible para proyectos freelance remotos a nivel internacional. Contacta para conversar sobre el alcance y las necesidades del proyecto.',
      },
      {
        question: '¿Pueden trabajar con Devariam empresas de Europa o del Golfo?',
        answer:
          'Se pueden conversar proyectos remotos con clientes de Europa, Arabia Saudita, Catar y los Emiratos Árabes Unidos. Abderrahmane trabaja desde Marruecos y no afirma tener oficinas en esos mercados.',
      },
      {
        question: '¿Cómo puedo hablar de un proyecto?',
        answer:
          'Usa la página de contacto o escribe a support@devariam.com. Un resumen de tus objetivos, entregables y plazos ayudará a iniciar la conversación.',
      },
    ],
    cta: 'Hablemos de tu proyecto',
  },
  ar: {
    label: 'الخدمات',
    title: 'تصميم المواقع وهندسة البرمجيات',
    intro:
      'Abderrahmane Charak مهندس برمجيات حاصل على دبلوم مهندس دولة ومصمم منتجات، ويعمل من مراكش بالمغرب. يعرض Devariam أعمالاً في تطوير الويب والأنظمة الخلفية وتطبيقات الهاتف والذكاء الاصطناعي للعملاء الباحثين عن شريك تقني للعمل عن بُعد.',
    projectsLink: 'استكشف المشاريع',
    servicesTitle: 'مجالات العمل',
    services: [
      {
        title: 'منصات وواجهات الويب',
        description:
          'تصميم وتطوير مواقع متجاوبة وتطبيقات ويب، بدءاً من تنظيم الواجهة وحتى التنفيذ. يركز العمل على وضوح تجربة المستخدم، وسهولة صيانة الشيفرة، والاستعداد للإطلاق.',
        technologies: ['React', 'Next.js', 'TypeScript'],
      },
      {
        title: 'تطوير الأنظمة الخلفية وواجهات API',
        description:
          'تنفيذ منطق الخادم وواجهات REST وطبقات البيانات لدعم إجراءات الأعمال وربط واجهات الويب ببيانات التطبيق.',
        technologies: ['Django', 'Flask', 'Node.js', 'REST'],
      },
      {
        title: 'تصميم المنتجات وتجربة المستخدم',
        description:
          'تصميم الواجهات وأنظمة التصميم باستخدام Figma، ثم تطبيق هذه القرارات في المنتج لتحقيق انسجام بين التجربة والتفاعل والمظهر.',
        technologies: ['Figma', 'أنظمة التصميم', 'تصميم التفاعل'],
      },
      {
        title: 'الذكاء الاصطناعي ومعالجة اللغة',
        description:
          'تطوير ميزات تعلم آلي تطبيقية، مثل تصنيف النصوص ومسارات المحادثة والأتمتة، استناداً إلى مشاريع موثقة.',
        technologies: ['Python', 'TensorFlow', 'NLTK'],
      },
    ],
    faqTitle: 'أسئلة شائعة',
    questions: [
      {
        question: 'من هو Abderrahmane Charak؟',
        answer:
          'Abderrahmane Charak مهندس برمجيات حاصل على دبلوم مهندس دولة، ويقيم في مراكش بالمغرب. يعرض ملفه أعمالاً في الويب والهاتف والأنظمة الخلفية وتصميم المنتجات والذكاء الاصطناعي التطبيقي.',
      },
      {
        question: 'ما هو Devariam؟',
        answer:
          'Devariam هو الملف المهني لـ Abderrahmane Charak ووسيلة التواصل معه بشأن مشاريع تطوير الويب والبرمجيات المستقلة.',
      },
      {
        question: 'ما الخدمات المتاحة؟',
        answer:
          'تشمل الخبرات الموثقة منصات وواجهات الويب، وتطوير الأنظمة الخلفية وواجهات REST، وتصميم المنتجات وتجربة المستخدم، والذكاء الاصطناعي ومعالجة اللغة الطبيعية.',
      },
      {
        question: 'هل يمكن تنفيذ برمجيات مخصصة أو middleware؟',
        answer:
          'يعرض الملف تطبيقات ويب وأعمالاً في الأنظمة الخلفية وواجهات REST. لا توثق المشاريع المنشورة middleware كمشروع مستقل؛ أرسل تفاصيل التكامل المطلوب لمناقشة مدى ملاءمته.',
      },
      {
        question: 'هل يمكن التعاون عن بُعد؟',
        answer:
          'نعم. يعمل Abderrahmane من مراكش ويتاح لمشاريع مستقلة عن بُعد مع عملاء دوليين. تواصل لمناقشة نطاق المشروع ومتطلباته.',
      },
      {
        question: 'هل يمكن للشركات في أوروبا أو الخليج التعاون مع Devariam؟',
        answer:
          'يمكن مناقشة مشاريع عن بُعد مع عملاء في أوروبا والسعودية وقطر والإمارات العربية المتحدة. يعمل Abderrahmane من المغرب ولا يدّعي وجود مكاتب في تلك الأسواق.',
      },
      {
        question: 'كيف أبدأ مناقشة مشروع؟',
        answer:
          'استخدم صفحة التواصل أو راسل support@devariam.com. يساعد إرسال ملخص للأهداف والمخرجات المطلوبة والجدول الزمني على بدء النقاش.',
      },
    ],
    cta: 'ناقش مشروعك',
  },
};
