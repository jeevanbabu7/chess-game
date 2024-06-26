export const EmitMoveSound = (chess) => {
    const move = chess.history().pop();
    let type = move[1] === 'x' ? "capture" : "move";
    if(chess.isCheckmate()) type = "mate";
    console.log(type);
    const sound = new Audio(`sounds/${type}.mp3`);
    sound.play();
};

export const EmitSound = (sound) => {

    const newSound = new Audio(`sounds/${sound}.mp3`);
    newSound.play()

};