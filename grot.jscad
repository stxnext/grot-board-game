// http://openjscad.org/

function get_arrow() {
    var arrow_long_path = CAG.roundedRectangle({
        center: [0, 0],
        radius: [7, 1],
        roundradius: 0.25,
        resolution: 6
    });
    var arrow_short_path = CAG.roundedRectangle({
        center: [0, 0],
        radius: [4, 1],
        roundradius: 0.25,
        resolution: 6
    });
    var arrow_long = arrow_long_path.extrude({offset: [0, 0, 1.1]});
    var arrow_left = arrow_short_path.extrude({offset: [0, 0, 1.1]});
    var arrow_right = arrow_short_path.extrude({offset: [0, 0, 1.1]});
    arrow_long =  arrow_long.translate([0, 0, 1.5]);
    arrow_left =  arrow_left.rotateZ(45);
    arrow_left =  arrow_left.translate([4.3, -2.15, 1.5]);
    arrow_right =  arrow_right.rotateZ(-45);
    arrow_right =  arrow_right.translate([4.3, 2.15, 1.5]);
    
    var arrow = arrow_long.union([arrow_left, arrow_right]);
    return arrow;
}

function get_cut_solid() {
    var cut_cone_up = CSG.cylinder({
        start: [0, 0, 3],
        end: [0, 0, 2],
        radiusStart: 9,
        radiusEnd: 10,
        resolution: 32
    });
    var cut_cylinder = CSG.cylinder({
        start: [0, 0, 2],
        end: [0, 0, -2],
        radius: 10,
        resolution: 32
    });
    var cut_cone_down = CSG.cylinder({
        start: [0, 0, -2],
        end: [0, 0, -3],
        radiusStart: 10,
        radiusEnd: 9,
        resolution: 32
    });
    cut_cylinder = cut_cylinder.union(cut_cone_up);
    cut_cylinder = cut_cylinder.union(cut_cone_down);
    return cut_cylinder;
}

function get_piece(direction) {
    var cylinder = CSG.cylinder({
        start: [0, 0, -2.5],
        end: [0, 0, 2.5],
        radius: 10,
        resolution: 32
    });
    
    var bottom_hole = CSG.cylinder({
        start: [0, 0, -0.5],
        end: [0, 0, -2.5],
        radius: 3,
        resolution: 16
    });
    
    cylinder = cylinder.subtract(get_arrow());

    if (direction === 'left'){
        cylinder = cylinder.rotateZ(90);
    } else if (direction === 'down'){
        cylinder = cylinder.rotateZ(180);
    } else if (direction === 'right'){
        cylinder = cylinder.rotateZ(270);
    }
    
    bottom_hole = bottom_hole.translate([0, -5, 0]);
    cylinder = cylinder.subtract(bottom_hole);
    cylinder = cylinder.intersect(get_cut_solid());

    return cylinder;
}

function get_field() {
    var field = CSG.cylinder({
        start: [0, 0, 2],
        end: [0, 0, 0.5],
        radius: 11,
        resolution: 32
    });
    var cone = CSG.cylinder({
        start: [0, 0, 3],
        end: [0, 0, 2],
        radiusStart: 12,
        radiusEnd: 11,
        resolution: 32
    });
    var bottom_hole = CSG.cylinder({
        start: [0, 0, 1.5],
        end: [0, 0, 0.5],
        radius: 2,
        resolution: 16
    });
    bottom_hole = bottom_hole.translate([0, -5, 0]);
    
    field = field.subtract(bottom_hole);
    field = field.union(cone);
    return field;
}

function get_text(text) {
    var letters = vector_text(0, 0, text);
    var objs = [];
    letters.forEach(function(letter) {
       objs.push(rectangular_extrude(letter, {w: 1.5, h: 1.5}));
    });
    var result = union(objs);
    result = center(true, result);
    result = result.rotateX(180);
    return result;
}

function get_board() {
    var board = CSG.roundedCube({
        center: [0, 0, 0],
        radius: [80, 80, 2.5],
        roundradius: 2,
        resolution: 16
    });
    
    var title = get_text("GROT");
    var subtitle = get_text("by STX Next");
    title = title.scale([1.5, 1.5, 1]);
    title = title.translate([0, 0, -2.5]);
    subtitle = subtitle.scale([0.3, 0.3, 1]);
    subtitle = subtitle.translate([28, 30, -2.5]);
    
    board = board.subtract([title, subtitle]);
    
    var field = get_field();
    var fields = [];
    for(var i=0; i<6; i+=1) {
        for(var j=0; j<6; j+=1) {
            fields.push(
                field.translate([
                    i*25.25-63, 
                    j*25.25-63, 
                    0
                ])
            );
        }
    }
    board = board.subtract(fields);
    board = board.translate([0, 0, 2.5]);
    return board;
}

function get_pieces() {
    var pieces = [];
    pieces.push(get_piece('up').translate([-12.5, -12.5, 2.5]));
    pieces.push(get_piece('down').translate([-12.5, 12.5, 2.5]));
    pieces.push(get_piece('left').translate([12.5, -12.5, 2.5]));
    pieces.push(get_piece('right').translate([12.5, 12.5, 2.5]));
    return pieces;
}

function main() {
    return get_board();
    //return get_pieces();
}
