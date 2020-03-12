    function SelectPlugin (option) {
        this.data = option.data;
        this.$elementMount = option.$elementMount; // ul 所挂载的元素
        this.$elementMountText = option.$elementMountText || '请选择...';  // 配置下拉框的初始化显示文本
        this.isShowQingkong = option.$isShowQingkong || false;  // 是否显示清空小图标
        this.isSearch = option.isSearch || false;  // 是否支持搜索
        this.isMultipleChoice = option.isMultipleChoice || false;
        this.searchVal = '';
        this.xuanzhongIconStyle = option.xuanzhongIconStyle || {"position":"absolute","right":"10px"};  // 配置选中图标的样式
        this.qingkongIconStyle = option.qingkongIconStyle || {"position":"absolute","right":"10px","top":"0px","line-height":"32px"};
        // this.callback = option.callback;
        this.afterClick = option.afterClick;
        this.init();
        
    }

    SelectPlugin.prototype.init =function(){
        this.appendElementqingkong();  // 配置清空元素
        this.setData(this.data);
        this.toggleUl();
        this.clickLiEve();
        this.qingkongClickEve();
        this.appendElementMountTextSpan();
        this.appendElementMountIdInput();
       
    },
    // 1. 点击元素切换下拉框显示隐藏
    SelectPlugin.prototype.toggleUl = function(){
        var data = 0;
        this.$elementMount.click(() => {
            // 利用节流解决多次触发点击事件问题
            if(new Date() - data < 200){
                return 
            }else {
                this.$elementMount.find('ul').slideToggle(200);
                data = new Date();
            }
            
        })
        
    },
    // 2. 构造 ul 元素 并将 ul 里面的数据改成动态数据
    SelectPlugin.prototype.setData = function(data){
        if(this.$elementMount.find('ul') && this.$elementMount.find('ul').length > 0){
            this.$elementMount.find('ul').remove();
        }
        var $ul = `<ul style="display: none;max-height: 300px;overflow-y: auto;"></ul>`
        this.$elementMount.append($ul)
         $.each(data,(indexLi,itemLi) => {
             var $li = '<li style="position: relative;" data-id= '+ itemLi["Id"] +'><span>'+ itemLi["Name"] +'</span></li>';
             this.$elementMount.find('ul').append($li);
         })  ;
        
         this.isSearchHandle();

         if(this.isSearch){
            this.$elementMount.find('ul li:eq(0) input').click(function(e){ 
                e.stopPropagation();
            })
            this.searchOnkeydοwnHandle();
        }
         
     },
     //添加容器内的显示文本元素与存放选中的id
     SelectPlugin.prototype.appendElementMountTextSpan = function() {
         // 配置容器的内容
        var $elementMountTextSpan = `<span class="elementMountTextSpan">${this.$elementMountText}</span>`;
        this.$elementMount.append($elementMountTextSpan);

        //配置存放id元素
        var $elementMountIdInput = `<input class="elementMountIdInput" type="hidden" value="4837b00d-fa2c-490b-bcf9-457567dc5102,a81a60fe-4cfc-4eab-bcca-a97f63ea069e"/>`;
        this.$elementMount.append($elementMountIdInput);
        
    },
    // 编辑时存在id 就回显(回显到页面与回显被选中的下拉框)
    SelectPlugin.prototype.appendElementMountIdInput = function(id = "Id") {
       
        if($('.elementMountIdInput').val()){
            $('.elementMountIdInput').val().split(',').forEach((itemInput) => {
                this.$elementMount.find('ul li').each((indexLi,itemLi) => {
                   if(itemInput == $(itemLi).attr('data-id')){
                       $(itemLi).trigger('click')
                   } 
                })
            })
        }
   },
   // 构造清空按钮
    SelectPlugin.prototype.appendElementqingkong = function() {
        // 配置清空按钮
        if(this.isShowQingkong){
            var $qingkongIcon = `<div><i class="iconfont icon-qingkong" id="qingkongIcon"></i></div>`
            this.$elementMount.append($qingkongIcon);
            this.$elementMount.find('.icon-qingkong').css(this.qingkongIconStyle)
        }
       
   },
   // 点击li 进行操作
    SelectPlugin.prototype.clickLiEve = function() {
        // 4. 选中li 数据 同步赋值到 div 中 ，同时 ul  隐藏
        this.$elementMount.find('ul li').click((e)=> {
            e.stopPropagation();
            
            // 6. 被选中的li 改变样式

            //  如果有被选中，再次点击就移除选中图标
            if($(e.target).find('.xuanzhongIcon')&&$(e.target).find('.xuanzhongIcon').length > 0){
                $(e.target).find('.xuanzhongIcon').remove();
            }else {
                var $selIcon = `<i class="iconfont icon-xuanzhong xuanzhongIcon"></i>`
                $(e.target).append($selIcon);
                this.$elementMount.find('.xuanzhongIcon').css(this.xuanzhongIconStyle)
            }
           
            // 如果不是多选就移除兄弟选中的图标
            if(!this.isMultipleChoice){
                $(e.target).siblings().find('.xuanzhongIcon').remove();
            }else {
               
            }
            // this.callback(this,e);
            this.afterClick && this.afterClick(this,e)
            this.searchVal = ''
            $('.isSearch').val('')
        })
       
        
    },
     // 5. 点击 div 上的 x 清空div 被赋上的值以及被选中的li 
    SelectPlugin.prototype.qingkongClickEve = function (){
        var that = this;
        var $qingkongIcon = that.$elementMount.parent().find('.icon-qingkong')
        if(that.isShowQingkong){
            $qingkongIcon.show();
            $qingkongIcon.click(function(e){
                e.stopPropagation()
                that.$elementMount.find('.elementMountTextSpan').text('请选择...');
                that.$elementMount.find('.xuanzhongIcon').remove();
                that.setData(that.data);
                that.clickLiEve();
            })
        }else {
            $qingkongIcon.hide();
        }
        
    },
    // 6. 判断是否需要配置搜索
    SelectPlugin.prototype.isSearchHandle = function(){
        if(this.isSearch){ 
            var searchLi = `<li style="padding-left: 0px"><input class="isSearch" value="" style="width: calc(100% - 10px);height: 100%;border: none;padding: 0 10px;font-size: 16px" placeholder="请输入..." /></li>`
            this.$elementMount.find('ul').prepend(searchLi);
            this.searchVal = this.searchVal?this.searchVal:'';
            $('.isSearch').val(this.searchVal)
        }
    }
    // 7. 搜索函数 ----> 键盘enter
    SelectPlugin.prototype.searchOnkeydοwnHandle = function(){
        var that = this;
        var newData = JSON.parse(JSON.stringify(that.data));
        this.$elementMount.find('ul li:eq(0) input').on('keyup',function(e){
            if(e.keyCode == 13){
               that.searchVal = $.trim($('.isSearch').val());
               var filterData = newData.filter(function(item){
                    if(item["Name"].indexOf(that.searchVal) > -1){
                        return item
                    }
                })
                if(filterData.length > 0){
                    that.setData(filterData);
                    that.$elementMount.trigger('click')
                } else {
                    that.setData(newData);
                    that.$elementMount.trigger('click')
                }
                that.clickLiEve();
            }
        })
    }
    

    
