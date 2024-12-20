

export function resposta_json(status, res, text, data) {
    var datetime = new Date().toISOString();
    var success_text = "true";
    if (status != 200 && status != 201 && status != 202) { success_text = "false"; }
    return res
        .status(status)
        .json({
            success: success_text,
            code: status,
            message: text,
            data: data,
            date: datetime,
        });
}