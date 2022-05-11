import GD from "../GD";

class MemebersManager {
  private members: Array<MemberVO> = [];
  private departaments: Map<number, DepartamentVO> = new Map();

  constructor() {
    GD.S_AUTH_COMPLETE.add(async () => {
      const resp = await GD.REQ_HTTP.invoke({
        method: "company.get",
      });
      if (resp.data) {
        this.members = (resp.data as SimpleObjectVO).m;
        (resp.data as SimpleObjectVO).dep.map((departament: DepartamentVO) => this.departaments.set(departament.id, departament));
        GD.S_MEMBERS_READY.invoke(this.members);
        GD.S_DEPARTAMENTS_READY.invoke(this.departaments);
      }
    });

    GD.S_WS_AUTHORIZED.add(() => {
      GD.S_WS_SEND.invoke({
        method: "getCompanyOnlineUsers",
        data: null,
      });
    });

    GD.S_SERVICE_READY.invoke("memebersManager");
  }
}

export default MemebersManager;
