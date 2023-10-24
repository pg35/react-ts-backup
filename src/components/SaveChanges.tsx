import { EDIT_UI, createAction } from "../utils/reducer";

export default function SaveChanges({ ui, data, dispatch, doAjax, slug }: any) {
  const { save, dirty } = ui;
  return (
    <div className={`${slug}-save`}>
      <button
        className="button button-primary"
        onClick={(e) => {
          e.preventDefault();
          dispatch(
            createAction(EDIT_UI, { save: { doing: true, result: null } })
          );
          doAjax(
            {
              data: {
                action: `${slug}_save`,
                data: JSON.stringify({ data })
              },
              method: "POST"
            },
            () =>
              dispatch(
                createAction(EDIT_UI, {
                  dirty: false,
                  save: { doing: false, result: { ok: true } }
                })
              ),
            (errMsg: string) =>
              dispatch(
                createAction(EDIT_UI, {
                  save: { doing: false, result: { ok: false, msg: errMsg } }
                })
              )
          );
        }}
        disabled={!dirty}
      >
        {save.doing ? "Saving..." : "Save changes"}
      </button>{" "}
      {
        //save.result && !dirty && (
        //removing dirty b/c msg should be in both success/fail
        save.result && (
          <span
            className={`${slug}-save__result ${slug}-${
              save.result.ok ? "success" : "error"
            }`}
          >
            {save.result.ok ? "Saved" : save.result.msg}
          </span>
        )
      }
    </div>
  );
}
