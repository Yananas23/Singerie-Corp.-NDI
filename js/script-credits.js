const teamMembers = [
      {
        name: "Yanis Boulogne",
        role: "Chef Singe Développeur",
        description: "Le gorille du code qui grimpe aux branches Git",
        color: "#f9e1bb",
        icon: "🦍",
        github: "https://github.com/Yananas23"
      },
      {
        name: "Timéo Rafidison",
        role: "Singeur Designer",
        description: "Il jongle avec les png comme des bananes",
        color: "#f9e1bb",
        icon: "🙊",
        github: "https://github.com/Redfire117"
      },
      {
        name: "Clement Szewczyk",
        role: "Chimpanzé 3D",
        description: "Il se balance dans Three.js comme dans les arbres",
        color: "#f9e1bb",
        icon: "🙈",
        github: "https://github.com/Clement-Szewczyk"
      },
      {
        name: "Julie Vandenberghe",
        role: "Ouistiti du Frontend",
        description: "Se balance d'un JS à l'autre",
        color: "#f9e1bb",
        icon: "🙉",
        github: "https://github.com/julie-vandenberghe"
      },
      {
        name: "Steven Guillemet",
        role: "Gibbon rieur",
        description: "Plein de grandes idées et de bonne humeur",
        color: "#f9e1bb",
        icon: "🐒",
        github: "https://github.com/GuillemetSteven"
      }
    ];

    const teamGrid = document.getElementById("teamGrid");

    teamMembers.forEach((member, index) => {
      const div = document.createElement("div");
      div.className = "team-card";
      div.style.animationDelay = (0.2 + index * 0.1) + "s";

      div.innerHTML = `
        <div class="icon-bubble" style="background:${member.color}; animation-delay:${index * 0.2}s">
          <span style="font-size:2rem;">${member.icon}</span>
        </div>
        <h3 class="member-name">${member.name}</h3>
        <p class="member-role">${member.role}</p>
        <p class="member-desc">${member.description}</p>
        <div class="icon-btn">
          <a href="${member.github}" target="_blank">
            <img src="./media/github-logo-white.svg" alt="GitHub"/>
          </a>
      </div>
      `;

      teamGrid.appendChild(div);
    });