"use strict";
var vertexShaderText =
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

//globalvariable///////////////////////////////////////////////////////////////
var Pmatrix;
var Vmatrix;
var Mmatrix;
var proj_matrix;
var view_matrix;
var mov_matrixtree;
var mov_matrixtree2;//ooooooooooooooooooooooooo
var treeIndices;
var treeIndices2;//ooooooooooooooooooooooo
var treeVertices;
var treeVertices2;//oooooooooooooooooooooooo
var vertexShader;
var fragmentShader;
var program;
var xpoint = 0.0;
var ypoint = 0.0;
var zpoint = 0.0;
var numberofnewbox = 0;
var InitDemo = function () {
    console.log('This is working');

    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL');
    }

    function newboxVertexshaderandFragmentshader() {
        //
        // Create shaders
        // 
        vertexShader = gl.createShader(gl.VERTEX_SHADER);
        fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vertexShader, vertexShaderText);
        gl.shaderSource(fragmentShader, fragmentShaderText);

        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
            return;
        }

        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
            return;
        }
    }//33333333333333333333333333333333333333333333333333333333333333333333333333333333
    newboxVertexshaderandFragmentshader();
    function newboxprogram() {
        program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('ERROR linking program!', gl.getProgramInfoLog(program));
            return;
        }
        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program!', gl.getProgramInfoLog(program));
            return;
        }
    }//33333333333333333333333333333333333333333333333333333333333333333333333333333333
    newboxprogram();
    function newboxcreation(treeVertices, treeIndices) {
        treeVertices =
 [ // X, Y, Z           R, G, B
     // Top
     -1.0, 1.0, -1.0, 0.5, 0.5, 0.5,
     -1.0, 1.0, 1.0, 0.5, 0.5, 0.5,
     1.0, 1.0, 1.0, 0.5, 0.5, 0.5,
     1.0, 1.0, -1.0, 0.5, 0.5, 0.5,

     // Left
     -1.0, 1.0, 1.0, 0.75, 0.25, 0.5,
     -1.0, -1.0, 1.0, 0.75, 0.25, 0.5,
     -1.0, -1.0, -1.0, 0.75, 0.25, 0.5,
     -1.0, 1.0, -1.0, 0.75, 0.25, 0.5,

     // Right
     1.0, 1.0, 1.0, 0.25, 0.25, 0.75,
     1.0, -1.0, 1.0, 0.25, 0.25, 0.75,
     1.0, -1.0, -1.0, 0.25, 0.25, 0.75,
     1.0, 1.0, -1.0, 0.25, 0.25, 0.75,

     // Front
     1.0, 1.0, 1.0, 1.0, 0.0, 0.15,
     1.0, -1.0, 1.0, 1.0, 0.0, 0.15,
     -1.0, -1.0, 1.0, 1.0, 0.0, 0.15,
     -1.0, 1.0, 1.0, 1.0, 0.0, 0.15,

     // Back
     1.0, 1.0, -1.0, 0.0, 1.0, 0.15,
     1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
     -1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
     -1.0, 1.0, -1.0, 0.0, 1.0, 0.15,

     // Bottom
     -1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
     -1.0, -1.0, 1.0, 0.5, 0.5, 1.0,
     1.0, -1.0, 1.0, 0.5, 0.5, 1.0,
     1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
 ];

        treeIndices =
        [
            // Top
            0, 1, 2,
            0, 2, 3,

            // Left
            5, 4, 6,
            6, 4, 7,

            // Right
            8, 9, 10,
            8, 10, 11,

            // Front
            13, 12, 14,
            15, 14, 12,

            // Back
            16, 17, 18,
            16, 18, 19,

            // Bottom
            21, 20, 22,
            22, 20, 23
        ];

        var treeVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, treeVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(treeVertices), gl.STATIC_DRAW);

        var treeIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, treeIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(treeIndices), gl.STATIC_DRAW);
        //return treeVertices, treeIndices;
    }//33333333333333333333333333333333333333333333333333333333333333333333333333333333
    newboxcreation(treeVertices, treeIndices);//oooooooooooooooooooooooooooooooooooooooooooooooooooo
    //newboxcreation(treeVertices2, treeIndices2);
    //newboxcreation();
    //var aaa1 = new newboxcreation();
    function newboxatrributes() {
        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.vertexAttribPointer(
            colorAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);

        // Tell OpenGL state machine which program should be active.
        gl.useProgram(program);


        /* ====== Associating attributes to vertex shader =====*/
        Pmatrix = gl.getUniformLocation(program, "mProj");
        Vmatrix = gl.getUniformLocation(program, "mView");
        Mmatrix = gl.getUniformLocation(program, "mWorld");
    }//33333333333333333333333333333333333333333333333333333333333333333333333333333333
    newboxatrributes();
    function newboxmatrix() {
        function get_projection(angle, a, zMin, zMax) {
            var ang = Math.tan((angle * .5) * Math.PI / 180);//angle*.5
            return [
               0.5 / ang, 0, 0, 0,
               0, 0.5 * a / ang, 0, 0,
               0, 0, -(zMax + zMin) / (zMax - zMin), -1,
               0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
            ];
        }

        proj_matrix = get_projection(40, canvas.width / canvas.height, 1, 100);

        var mov_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

        //lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll


        // translating z
        view_matrix[14] = view_matrix[14] - 6;//zoom

        /*==================== Rotation ====================*/
        //function XdireMov(m, amount) { m[12] += 0.005;}
        function rotateZ(m, angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv0 = m[0], mv4 = m[4], mv8 = m[8];

            m[0] = c * m[0] - s * m[1];
            m[4] = c * m[4] - s * m[5];
            m[8] = c * m[8] - s * m[9];

            m[1] = c * m[1] + s * mv0;
            m[5] = c * m[5] + s * mv4;
            m[9] = c * m[9] + s * mv8;
        }

        function rotateX(m, angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv1 = m[1], mv5 = m[5], mv9 = m[9];

            m[1] = m[1] * c - m[2] * s;
            m[5] = m[5] * c - m[6] * s;
            m[9] = m[9] * c - m[10] * s;

            m[2] = m[2] * c + mv1 * s;
            m[6] = m[6] * c + mv5 * s;
            m[10] = m[10] * c + mv9 * s;
        }

        function rotateY(m, angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv0 = m[0], mv4 = m[4], mv8 = m[8];

            m[0] = c * m[0] + s * m[2];
            m[4] = c * m[4] + s * m[6];
            m[8] = c * m[8] + s * m[10];

            m[2] = c * m[2] - s * mv0;
            m[6] = c * m[6] - s * mv4;
            m[10] = c * m[10] - s * mv8;
        }
    }//33333333333333333333333333333333333333333333333333333333333333333333333333333333
    newboxmatrix();
    function newboxorentation(m)
    {
        mov_matrixtree = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, m, 0, 0, 1];
        
    }//33333333333333333333333333333333333333333333333333333333333333333333333333333333
    function newboxdrow(m) {
        mov_matrixtree = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, m, 0, 0, 1];
        gl.uniformMatrix4fv(Mmatrix, false, mov_matrixtree);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }//33333333333333333333333333333333333333333333333333333333333333333333333333333333
    /*================= Drawing ===========================*/
    var time_old = 0;

    var animate = function (time) {

        var dt = time - time_old;
        
        //rotateZ(mov_matrix, dt * 0.005);//time
        //rotateY(mov_matrix, dt * 0.002);
        //rotateX(mov_matrix, dt * 0.003);
        //llllllllllllllllllllllllllllllllllllllllllllllllllllll
        //newboxorentation(xpoint - 2, mov_matrixtree);//ooooooooooooooooooooooooooooooooooooooooooooooo
        //newboxorentation(3, mov_matrixtree2);
        //newboxorentation(xpoint, mov_matrixtree2);
        //mov_matrixtree2 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, xpoint, 0, 0, 1];
        //newboxorentation(xpoint - 2);
        //llllllllllllllllllllllllllllllllllllllllllllllllllllll
        time_old = time;
        gl.clearColor(0, 0, 200, 1.0);
        ////gl.depthFunc(gl.LEQUAL);
        ////gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        //gl.enable(gl.CULL_FACE);
        //gl.frontFace(gl.CCW);
        //gl.cullFace(gl.BACK);
        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
        gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
        //gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
        //gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        //lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
        
        newboxdrow( xpoint);//ooooooooooooooooooooooooooooooooo
        newboxdrow(-3);
        newboxdrow(3);
        //newboxdrow(mov_matrixtree2);
        //gl.uniformMatrix4fv(Mmatrix, false, mov_matrixtree2);
       // gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        window.requestAnimationFrame(animate);
    };
    //requestAnimationFrame(animate);
    animate(0);
};


//qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq

////////////////////////////////////////////////////////////////////////////////////////////


