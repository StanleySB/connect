import GD from "../GD";

class MemebersManager {
  private foundedItems: FoundedItemVO = { members: [], latests: [], departaments: new Map() };

  private members: Array<MemberVO> = [];
  private latests: Array<ChatVO> = [];
  private departaments: Map<number, DepartamentVO> = new Map();

  constructor() {
    GD.S_MESSENGER_SEARCH_REQUEST.add((searchText) => {
      this.findItem(searchText);
    });

    GD.S_LATEST_READY.add((data) => {
      this.latests = data;
    }, "latestPanel");

    GD.S_MEMBERS_READY.add((data) => {
      this.members = data;
    }, "memberPanel");

    GD.S_DEPARTAMENTS_READY.add((data) => {
      this.departaments = data;
    }, "memberPanel");

    GD.S_SERVICE_READY.invoke("messengerSearchManager");
  }

  private async findItem(searchText: string) {
    let findedMembers;
    let findedLatests;

    console.log(this.members, this.latests);
    findedMembers = this.members.filter((member) =>
      searchText
        .toLocaleLowerCase()
        .split(" ")
        .map((searchItem) => member.name.toLocaleLowerCase().startsWith(searchItem))
        .includes(true)
    );

    findedLatests = this.latests.filter((latest) =>
      searchText
        .toLocaleLowerCase()
        .split(" ")
        .map(
          (searchItem) =>
            latest.title.toLocaleLowerCase().includes(searchItem) ||
            latest.users.map((user) => user.name.toLocaleLowerCase().startsWith(searchItem)).includes(true)
        )
        .includes(true)
    );

    this.foundedItems.members = findedMembers;
    this.foundedItems.latests = findedLatests;
    this.foundedItems.departaments = this.departaments;

    GD.S_MESSENGER_SEARCH_READY.invoke(this.foundedItems);
  }
}

export default MemebersManager;
