module.exports = new function () {
    //���̺��� �ش� ���Կ� ���� �����Ѵ�.
    this.SetTableSlotValue = function (table, slots, value) {
        for (var i = 0; i < slots.length; i++) {
            var slot = slots[i];
            
            if (i == slots.length - 1) {
                table[slot] = value;
                return;
            }
            if (!(slot in table)) {
                table[slot] = {};
            }
            table = table[slot];
        }
    }
    
    //���̺��� �ش� ���Կ� ���� �߰��Ѵ�.
    this.AddTableSlotValue = function (table, slots, value) {
        for (var i = 0; i < slots.length; i++) {
            var slot = slots[i];
            
            if (i == slots.length - 1) {
                if (!table[slot]) {
                    table[slot] = [];
                }
                table[slot].push(value);
                return;
            }
            if (!(slot in table)) {
                table[slot] = {};
            }
            table = table[slot];
        }
    }
    
    //���̺��� �ش� ���Կ� ����� ���� ��´�.
    //������ ���ٸ� null.
    this.GetTableSlotValue = function (table, slots) {
        for (var i = 0; i < slots.length; i++) {
            var slot = slots[i];
            
            if (i == slots.length - 1) {
                return (slot in table) ? table[slot] : null;
            }
            if (!(slot in table)) {
                return null;
            }
            table = table[slot];
        }
    }
    
    //�� ��ü�� �ʵ带 �����Ѵ�.
    this.Extend = function (obj1, obj2) {
        var obj3 = {};
        if (obj1) {
            for (var n in obj1) { obj3[n] = obj1[n]; }
        }
        
        if (obj2) {
            for (var n in obj2) { obj3[n] = obj2[n]; }
        }
        return obj3;
    }
    
    //�� �迭�� ��ģ��.
    this.Merge = function (array1, array2) {
        if (!array1) {
            array1 = [];
        }
        
        if (!array2) {
            array2 = [];
        }
        
        var merged = array1.concat(array2);
        return merged;
    }
    
    // �� �迭�� �������� ���Ѵ�.
    this.Intersect = function (array1, array2) {
        var result = [];
        array1.forEach(function (v) {
            if (array2.indexOf(v) != -1) {
                result.push(v);
            }
        });
        return result;
    }
    
    // �迭�ȿ� ���� �����ϴ��� Ȯ��.
    this.IsInArray = function (array, value) {
        if (!array) {
            return false;
        }

        if (!Array.isArray(array)) {
            return false;
        }

        return array.indexOf(value) > -1;
    }
    
    // �־��� �迭�� �����Ѵ�.
    // limit �� �־����ٸ� �ش� ������ŭ�� �����Ѵ�.
    // (����� �ε��� 0���� (limit-1)����)
    this.ShuffleArray = function (array, limit) {
        if (!limit) {
            limit = array.length;
        }

        for (var i = 0; i < limit; i++) {
            var selectedIndex = i + Math.floor(Math.random() * (array.length - i));
            var temp = array[selectedIndex];
            array[selectedIndex] = array[i];
            array[i] = temp;
        }
    }
}
