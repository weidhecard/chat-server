const users = [
    {
        email: "test1@hotmail.com",
        username: "testing1",
        password: "testing123",
        firstName: "testing",
        lastName: "1",
        phone: 173829472,
    },
    {
        email: "test2@hotmail.com",
        username: "testing2",
        password: "testing1234",
        firstName: "testing",
        lastName: "1",
        phone: 173829473,
    },
    {
        email: "test3@hotmail.com",
        username: "testing 3",
        password: "testing33",
        firstName: "testing",
        lastName: "1",
        phone: 173829474,
    },
    {
        email: "test4@hotmail.com",
        username: "testing4",
        password: "testing44",
        firstName: "testing",
        lastName: "1",
        phone: 173829475,
    },
    {
        email: "test5@hotmail.com",
        username: "testing5",
        password: "testing55",
        firstName: "testing",
        lastName: "1",
        phone: 173829476,
    },
];

const rooms = [
    {
        subject: "Computer Science",
        description: "the study of computation, information, and automation",
    },
    {
        subject: "Electrical Engineering",
        description:
            "engineering discipline concerned with the study, design, and application of equipment which use electricity, electronics, and electromagnetism",
    },
    {
        subject: "Mechanical Engineering",
        description:
            "one of the broadest engineering disciplines, offering opportunities to specialize in areas such as robotics, aerospace, automotive engineering",
    },
    {
        subject: "Civil Engineering",
        description: "project includes facilities, bridges, roads, tunnels, and water and sewage systems",
    },
    {
        subject: "Mechatronic Engineering",
        description: "intersection of mechanics, electronics, and computing",
    },
    {
        subject: "Computer Engineering",
        description:
            "a branch of computer science and electronic engineering integrated together to develop computer hardware and software",
    },
    {
        subject: "Bio Engineering",
        description:
            "the application of engineering principles to improve disease prevention and treatment, agricultural production, energy sustainability, and more",
    },
    {
        subject: "Chemical Engineering",
        description: "conceive and design processes to produce, transform, and transport materials ",
    },
];

const seedDefault = { users, rooms };

export { seedDefault };
