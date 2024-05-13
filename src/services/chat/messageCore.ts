class MessageCore {
    roomId: any;
    userId: any;
    name: any;
    from: any;
    message: any;
    externalEvent: any;
    firstName: any;
    lastName: any;
    phone: any;
    image: any;
    time: any;
    connectedUsers: any = [];

    constructor() {}

    public getData() {
        return {
            roomId: this.roomId,
            name: this.name,
            from: this.from,
            message: this.message,
            externalEvent: this.externalEvent,
            userId: this.userId,
            firstName: this.firstName,
            lastName: this.lastName,
            phone: this.phone,
            image: this.image,
            time: this.time,
            connectedUsers: this.connectedUsers,
        };
    }

    public setData(socket: any) {
        const userId = socket.handshake.query.userId;
        const phone = socket.handshake.query.phone;
        const firstName = socket.handshake.query.firstName;
        const lastName = socket.handshake.query.lastName ?? "";
        const image = socket.handshake.query.image;

        this.roomId = null;
        this.name = `${firstName} ${lastName}`;
        this.from = `${firstName} ${lastName} (${phone})`;
        this.message = "";
        this.externalEvent = true;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.image = image;
        this.time = new Date();

        return this;
    }

    public getConnectUser(roomId: any = "") {
        return this.connectedUsers.filter((e: any) => {
            return e.roomId == roomId;
        });
    }

    public setConnectUser(info: any = {}) {
        this.connectedUsers.push(info);
    }

    public removeConnectUser(userId: any) {
        const users = this.connectedUsers.filter((e: any) => {
            return e.userId !== userId;
        });
        this.connectedUsers = users;
    }

    public resetData() {
        this.roomId = this.roomId;
        this.name = this.name;
        this.from = this.from;
        this.message = this.message;
        this.externalEvent = this.externalEvent;
        this.userId = this.userId;
        this.firstName = this.firstName;
        this.lastName = this.lastName;
        this.phone = this.phone;
        this.image = this.image;
    }

    public formatSend(set: any) {
        return {
            userId: set.userId,
            roomId: set.roomId,
            message: set.message,
            externalEvent: set.externalEvent,
            time: new Date(),
        };
    }
}

export { MessageCore };
