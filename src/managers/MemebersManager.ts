import GD from "../GD";

class MemebersManager {
  private members: Array<MemberVO> = [];

  constructor() {
    GD.S_AUTH_COMPLETE.add(async () => {
      const resp = await GD.REQ_HTTP.invoke({
        method: "company.get",
      });
      if (resp.data) {
        this.members = (resp.data as SimpleObjectVO).m;
        GD.S_MEMBERS_READY.invoke(this.members);
      }
    });

    GD.S_SERVICE_READY.invoke("memebersManager");
  }
}

export default MemebersManager;
