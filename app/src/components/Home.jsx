import React from "react";

const TeamMember = ({ name, designation, image, delay }) => {
  return (
    <div
      className={`col-12 col-sm-6 col-lg-3 wow fadeInUp`}
      data-wow-delay={delay}
      style={{ visibility: "visible", animationDelay: delay, animationName: "fadeInUp" }}
    >
      <div className="relative mb-12 transition-all duration-500 z-1 rounded-lg shadow-lg">
        <div className="relative z-1 rounded-t-lg mx-auto pt-8 pl-8 bg-blue-600 overflow-hidden">
          <img className="mx-auto rounded-sm h-[20em]" src={image} alt={name} />
          <div className="absolute bottom-0 right-8 text-right">
            <a href="#" className="text-white mx-2 hover:text-gray-400">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="#" className="text-white mx-2 hover:text-gray-400">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="#" className="text-white mx-2 hover:text-gray-400">
              <i className="fa fa-linkedin"></i>
            </a>
          </div>
        </div>
        <div className="relative z-1 py-8 px-8 text-right bg-white rounded-b-lg transition-all duration-500">
          <h6 className="mb-1 transition-all duration-500">{name}</h6>
          <p className="text-sm transition-all duration-500">{designation}</p>
          <div className="absolute top-3 right-8 w-12 h-0.5 bg-blue-600"></div>
          <div className="absolute w-full h-10 left-0 top-0 bg-white" style={{ transform: 'skewY(-7deg)', transformOrigin: 'bottom left' }}></div>
        </div>
      </div>
    </div>
  );
};

const Team = () => {
  const teamMembers = [
    { name: "Samantha Sarah", designation: "Founder & CEO", image: "https://bootdey.com/img/Content/avatar/avatar1.png", delay: "0.2s" },
    { name: "Nazrul Islam", designation: "UI Designer", image: "https://bootdey.com/img/Content/avatar/avatar7.png", delay: "0.3s" },
    { name: "Riyadh Khan", designation: "Developer", image: "https://bootdey.com/img/Content/avatar/avatar6.png", delay: "0.4s" },
    { name: "Niloy Islam", designation: "Marketing Manager", image: "https://bootdey.com/img/Content/avatar/avatar2.png", delay: "0.5s" }
  ];

  return (
    <div className="container mx-auto mt-12">
      <div className="flex flex-row gap-2">
        {teamMembers.map((member, index) => (
          <TeamMember
            key={index}
            name={member.name}
            designation={member.designation}
            image={member.image}
            delay={member.delay}
          />
        ))}
      </div>
    </div>
  );
};

export default Team;