// ==UserScript==
// @name         Image Pokémon Names
// @namespace    https://example.com/
// @version      1.2.6
// @description  Hiển thị hình ảnh trong name Pokémon
// @author       Hexros Raymond
// @match        *://*/truyen/*/*/*/
// @require     https://cdn.jsdelivr.net/npm/axios@v1.0.0-alpha.1/dist/axios.min.js
// @require     https://cdn.jsdelivr.net/npm/axios-userscript-adapter@0.2.0-alpha.2
// @grant       GM.xmlHttpRequest
// ==/UserScript==


(function () {
    'use strict';

    function loadImage() {
        var italicTags = document.getElementsByTagName('i');

        for (var i = 0; i < italicTags.length; i++) {
            var content = italicTags[i].textContent || italicTags[i].innerText;
            if (content.includes('<img')) {
                italicTags[i].innerHTML = content;
            }
        }


        const styleImg = document.querySelectorAll('.pokemon-image');
        styleImg.forEach(element => {
            element.style.display = 'inline-block';
            element.style.margin = '-25px -5px -20px 0';
            element.style.width = '65px';
            element.style.height = '65px';
        });

        const styleType = document.querySelectorAll('.pokemon-type');
        styleType.forEach(element => {
            element.style.display = 'inline-block';
            element.style.margin = '-5px -2px 0px 2px';
            element.style.width = '25px';
            element.style.height = '25px';
        });

        const styleBall = document.querySelectorAll('.pokemon-ball');
        styleBall.forEach(element => {
            element.style.display = 'inline-block';
            element.style.margin = '-5px 0 0 2px';
            element.style.width = '35px';
            element.style.height = '35px';
        });

        const styleItem = document.querySelectorAll('.pokemon-item');
        styleItem.forEach(element => {
            element.style.display = 'inline-block';
            element.style.margin = '-5px 0 0 2px';
            element.style.width = '35px';
            element.style.height = '35px';
        });
    }

    function createButton(text, onClickFunction, bottomOffset) {
        var button = document.createElement('button');
        button.textContent = text;

        let styles = {
            position: 'fixed',
            bottom: bottomOffset + 'px',
            right: '10px',
            fontSize: '14px',
            outline: 'none',
            borderRadius: '100%',
            height: '50px',
            width: '50px',
        };

        Object.assign(button.style, styles);
        button.addEventListener('click', onClickFunction);
        document.body.appendChild(button);
        return button;
    }

    function copyName() {
        createButton('Copy', copyContent, 160);
        var copyText = document.querySelector("#namewd").value;
        async function copyContent(e) {
            try {
                e.target.textContent = 'Copied';
                await navigator.clipboard.writeText(copyText);
            } catch (err) {
                e.target.textContent = 'Failed';
                console.error(`Error:::${err}`);
            } finally {
                setTimeout(() => {e.target.textContent = 'Copy'; }, 2000);
            }
        }
    }

    function getName(){
       createButton('Get', pasteContent, 280);
        axios.defaults.adapter = axiosGmxhrAdapter;
        async function pasteContent(e){
            try{
                document.querySelector("button[onclick='showNS()']").click();
                const text = (await axios.get("https://raw.githubusercontent.com/hexros-dev/pokemon/main/PokemonNames.txt")).data;
                e.target.textContent = 'Done!';
                document.querySelector('#namewd').value += text;
            }catch(err){
                e.target.textContent = 'Failed';
                console.log(`Error:::${err}`);
                alert(err);
            }finally{
                setTimeout(() => {e.target.textContent = 'Get';}, 2000);
                document.querySelector("button[onclick='saveNS();excute();']").click();
                document.querySelector("button[onclick='hideNS()']").click();
                document.querySelector("button[onclick='excute()']").click();
            }
        }
    }

    function runName() {
        createButton('Start', function() {
            document.querySelector("button[onclick='excute()']").click();
        }, 220);
    }

    function showNS() {
        createButton('Names', function() {
            document.querySelector("button[onclick='showNS()']").click();
        }, 100);
    }



    window.onload = function () {
        loadImage();

        const button = document.querySelector('[onclick="excute()"]');
        button.addEventListener('click', function () {
            loadImage();
        });

        copyName();
        runName();
        showNS();
        getName();
    };
})();
