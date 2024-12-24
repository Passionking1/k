// ==UserScript==
// @name         深圳技术大学教学评价自动选择
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动选择教学评价选项：随机一个选"大体同意"，其他选"同意"
// @author       You
// @match        *://jwxt.sztu.edu.cn/*
// @match        *://*.sztu.edu.cn/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    
    // 调试输出
    console.log('脚本已加载');

    // 创建一个按钮
    function createButton() {
        console.log('尝试创建按钮');
        // 检查按钮是否已存在
        if (document.getElementById('autoEvalButton')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'autoEvalButton';
        button.textContent = '一键评价';
        button.style.position = 'fixed';
        button.style.top = '50px';
        button.style.right = '10px';
        button.style.zIndex = '999999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        
        button.onclick = autoSelect;
        document.body.appendChild(button);
        console.log('按钮已创建');
    }

    // 自动选择功能
    function autoSelect() {
        console.log('开始自动选择');
        try {
            // 获取所有表格行
            const rows = Array.from(document.querySelectorAll('tr')).filter(row => {
                return row.querySelector('input[type="radio"]');
            });
            
            console.log('找到评价行数：', rows.length);

            // 随机选择一行设置为"大体同意"
            const randomIndex = Math.floor(Math.random() * rows.length);
            console.log('随机选择第', randomIndex + 1, '行为大体同意');
            
            // 遍历每一行
            rows.forEach((row, index) => {
                const radios = row.querySelectorAll('input[type="radio"]');
                console.log(`第${index + 1}行有${radios.length}个选项`);
                
                // 随机选中的行选择"大体同意"
                if (index === randomIndex) {
                    const targetRadio = Array.from(radios).find(radio => 
                        radio.parentElement && radio.parentElement.textContent.includes('大体同意'));
                    if (targetRadio) {
                        targetRadio.checked = true;
                        console.log(`第${index + 1}行已选择大体同意`);
                    }
                } else {
                    // 其他行选择"同意"
                    const targetRadio = Array.from(radios).find(radio => 
                        radio.parentElement && radio.parentElement.textContent.includes('同意') &&
                        !radio.parentElement.textContent.includes('大体') &&
                        !radio.parentElement.textContent.includes('基本'));
                    if (targetRadio) {
                        targetRadio.checked = true;
                        console.log(`第${index + 1}行已选择同意`);
                    }
                }
            });
            
            alert('评价选项已自动选择完成！');
        } catch (error) {
            console.error('自动选择出错：', error);
            alert('自动选择出错，请查看控制台了解详情');
        }
    }

    // 处理iframe情况
    function init() {
        console.log('初始化脚本');
        // 如果当前页面包含评价相关内容，创建按钮
        if (document.querySelector('input[type="radio"]')) {
            createButton();
        }
        
        // 监听iframe加载
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (document.querySelector('input[type="radio"]')) {
                    createButton();
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 