/*
  ImportExportTools NG modPEC id a fork of ImportExportTools NG with added
  functionalities to export and verify SMIME messages and generate a hash
  list of the exported messages. It is intended to be used to backup
  Italian Certified Email (PEC) messages.
  The MOD author:
    Copyright (C) 2019 : Alberto Pianon

	ImportExportTools NG is a derivative extension for Thunderbird 60+
	providing import and export tools for messages and folders.
	The derivative extension authors:
		Copyright (C) 2019 : Christopher Leidigh, The Thunderbird Team

	The original extension & derivatives, ImportExportTools, by Paolo "Kaosmos",
	is covered by the GPLv3 open-source license (see LICENSE file).
		Copyright (C) 2007 : Paolo "Kaosmos"

	ImportExportTools NG is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// cleidigh - reformat, services, globals, dialog changes

/* global IETprefs, IETgetComplexPref, IETsetComplexPref, IETpickFile */

var { Services } = ChromeUtils.import('resource://gre/modules/Services.jsm');

function IETsetCharsetPopup(charsetPref) {
    const versionChecker = Services.vc;
    const currentVersion = Services.appinfo.platformVersion;


    var charsetPopup = document.getElementById("charset-list-popup");
    var charsetList = IETprefs.getCharPref("extensions.importexporttoolsngmodpec.export.charset_list");
    var charsetItems = charsetList.split(",");
    var menuitem;

    for (var i = 0; i < charsetItems.length; i++) {
        if (versionChecker.compare(currentVersion, "68") >= 0) {
            // replacement for createElement post TB60
            menuitem = document.createXULElement("menuitem");
        } else {
            menuitem = document.createElement("menuitem");
        }

        menuitem.setAttribute("label", charsetItems[i]);
        menuitem.setAttribute("value", charsetItems[i]);
        charsetPopup.appendChild(menuitem);
        if (charsetItems[i] === charsetPref)
            document.getElementById("charset-list").selectedItem = menuitem;
    }
}

function initMboxImportPanel() {

    const versionChecker = Services.vc;
    const currentVersion = Services.appinfo.platformVersion;

    // cleidigh - TB68 groupbox needs hbox/label
    if (versionChecker.compare(currentVersion, "61") >= 0) {
        var captions = document.querySelectorAll("caption");
        for (let i = 0; i < captions.length; i++) {
            captions[i].style.display = "none";
        }
    } else {
        var groupboxtitles = document.querySelectorAll(".groupbox-title");
        for (let i = 0; i < groupboxtitles.length; i++) {
            groupboxtitles[i].style.display = "none";
        }
    }

    IETsetCharsetPopup("");

    document.getElementById("MBoverwrite").checked = IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.export.overwrite");
    document.getElementById("MBasciiname").checked = IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.export.filenames_toascii");
    document.getElementById("MBconfrimimport").checked = IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.confirm.before_mbox_import");
    document.getElementById("MBhtmlasdisplayed").checked = IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.export.HTML_as_displayed");
    document.getElementById("MBcliptextplain").checked = IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.clipboard.always_just_text");
    document.getElementById("MBsubmaxlen").value = IETprefs.getIntPref("extensions.importexporttoolsngmodpec.subject.max_length");
    document.getElementById("MBauthmaxlen").value = IETprefs.getIntPref("extensions.importexporttoolsngmodpec.author.max_length");
    document.getElementById("MBrecmaxlen").value = IETprefs.getIntPref("extensions.importexporttoolsngmodpec.recipients.max_length");
    document.getElementById("setTimestamp").checked = IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.export.set_filetime");
    document.getElementById("addtimeCheckbox").checked = IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.export.filenames_addtime");
    document.getElementById("buildMSF").checked = IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.import.build_mbox_index");
    document.getElementById("addNumber").checked = IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.import.name_add_number");

    if (IETprefs.getIntPref("extensions.importexporttoolsngmodpec.exportEML.filename_format") === 2)
        document.getElementById("customizeFilenames").checked = true;
    else
        document.getElementById("customizeFilenames").checked = false;

    if (IETprefs.getPrefType("extensions.importexporttoolsngmodpec.exportMBOX.dir") > 0)
        document.getElementById("export_mbox_dir").value = IETgetComplexPref("extensions.importexporttoolsngmodpec.exportMBOX.dir");
    if (IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.exportMBOX.use_dir")) {
        document.getElementById("use_export_mbox_dir").checked = true;
        document.getElementById("export_mbox_dir").removeAttribute("disabled");
        document.getElementById("export_mbox_dir").nextSibling.removeAttribute("disabled");
    } else {
        document.getElementById("use_export_mbox_dir").checked = false;
        document.getElementById("export_mbox_dir").setAttribute("disabled", "true");
        document.getElementById("export_mbox_dir").nextSibling.setAttribute("disabled", "true");
    }

    if (IETprefs.getPrefType("extensions.importexporttoolsngmodpec.exportEML.dir") > 0)
        document.getElementById("export_eml_dir").value = IETgetComplexPref("extensions.importexporttoolsngmodpec.exportEML.dir");
    if (IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.exportEML.use_dir")) {
        document.getElementById("use_export_eml_dir").checked = true;
        document.getElementById("export_eml_dir").removeAttribute("disabled");
        document.getElementById("export_eml_dir").nextSibling.removeAttribute("disabled");
    } else {
        document.getElementById("use_export_eml_dir").checked = false;
        document.getElementById("export_eml_dir").setAttribute("disabled", "true");
        document.getElementById("export_eml_dir").nextSibling.setAttribute("disabled", "true");
    }

    if (IETprefs.getPrefType("extensions.importexporttoolsngmodpec.exportMSG.dir") > 0)
        document.getElementById("export_msgs_dir").value = IETgetComplexPref("extensions.importexporttoolsngmodpec.exportMSG.dir");
    if (IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.exportMSG.use_dir")) {
        document.getElementById("use_export_msgs_dir").checked = true;
        document.getElementById("export_msgs_dir").removeAttribute("disabled");
        document.getElementById("export_msgs_dir").nextSibling.removeAttribute("disabled");
    } else {
        document.getElementById("use_export_msgs_dir").checked = false;
        document.getElementById("export_msgs_dir").setAttribute("disabled", "true");
        document.getElementById("export_msgs_dir").nextSibling.setAttribute("disabled", "true");
    }

    if (IETprefs.getPrefType("extensions.importexporttoolsngmodpec.export.filename_pattern") > 0) {
        var pattern = IETprefs.getCharPref("extensions.importexporttoolsngmodpec.export.filename_pattern");
        var patternParts = pattern.split("-");

        for (var i = 0; i < 3; i++) {
            var list = document.getElementById(`part${i + 1}`);
            var popup = document.getElementById(`part${i + 1}-popup-list`);

            switch (patternParts[i]) {
                case "%d":
                    list.selectedItem = popup.childNodes[1];
                    break;
                case "%k":
                    list.selectedItem = popup.childNodes[2];
                    break;
                case "%n":
                    list.selectedItem = popup.childNodes[3];
                    break;
                case "%a":
                    list.selectedItem = popup.childNodes[4];
                    break;
                case "%r":
                    list.selectedItem = popup.childNodes[5];
                    break;
                case "%e":
                    list.selectedItem = popup.childNodes[6];
                    break;
                default:
                    list.selectedItem = popup.childNodes[0];
            }
        }
    }

    document.getElementById("addPrefix").checked = IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.export.filename_add_prefix");
    try {
        document.getElementById("prefixText").value = IETgetComplexPref("extensions.importexporttoolsngmodpec.export.filename_prefix");
    } catch (e) {}

    document.getElementById("cutSub").checked = IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.export.cut_subject");
    document.getElementById("cutFN").checked = IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.export.cut_filename");
    customNamesCheck(document.getElementById("customizeFilenames"));

    var charset = "";
    var textCharset = "";
    var csvSep = "";

    try {
        charset = IETprefs.getCharPref("extensions.importexporttoolsngmodpec.export.filename_charset");
        textCharset = IETprefs.getCharPref("extensions.importexporttoolsngmodpec.export.text_plain_charset");
        csvSep = IETprefs.getCharPref("extensions.importexporttoolsngmodpec.csv_separator");
    } catch (e) {
        charset = "";
        textCharset = "";
        csvSep = "";
    }

    IETsetCharsetPopup(textCharset);
    document.getElementById("filenameCharset").value = charset;
    document.getElementById("csvSep").value = csvSep;

    document.getElementById("skipMsg").checked = IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.export.skip_existing_msg");
    if (IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.export.use_container_folder")) {
        document.getElementById("indexSetting").selectedIndex = 0;
        document.getElementById("skipMsg").disabled = true;
    } else {
        document.getElementById("indexSetting").selectedIndex = 1;
    }

    //modPEC 
 if (IETprefs.getIntPref("extensions.importexporttoolsngmodpec.export.cut_filename_at") == 256)
        document.getElementById("cutFNat").selectedIndex = 0;
    else
      document.getElementById("cutFNat").selectedIndex = 1;
    //modPEC

    // Backup section
    var freq = IETprefs.getIntPref("extensions.importexporttoolsngmodpec.autobackup.frequency");

    switch (freq) {
        case 1:
            document.getElementById("frequencyList").selectedIndex = 0;
            document.getElementById("backupEnable").checked = true;
            break;
        case 3:
            document.getElementById("frequencyList").selectedIndex = 1;
            document.getElementById("backupEnable").checked = true;
            break;
        case 7:
            document.getElementById("frequencyList").selectedIndex = 2;
            document.getElementById("backupEnable").checked = true;
            break;
        case 15:
            document.getElementById("frequencyList").selectedIndex = 3;
            document.getElementById("backupEnable").checked = true;
            break;
        case 30:
            document.getElementById("frequencyList").selectedIndex = 4;
            document.getElementById("backupEnable").checked = true;
            break;
        default:
            document.getElementById("backupEnable").checked = false;
            document.getElementById("frequencyList").disabled = true;
    }

    try {
        document.getElementById("backupDir").value = IETgetComplexPref("extensions.importexporttoolsngmodpec.autobackup.dir");
        document.getElementById("backupCustomName").value = IETgetComplexPref("extensions.importexporttoolsngmodpec.autobackup.dir_custom_name");
    } catch (e) {}

    document.getElementById("backupType").selectedIndex = IETprefs.getIntPref("extensions.importexporttoolsngmodpec.autobackup.type");
    var dir = IETprefs.getIntPref("extensions.importexporttoolsngmodpec.autobackup.dir_name_type");
    document.getElementById("backupDirName").selectedIndex = dir;
    document.getElementById("backupType").selectedIndex = IETprefs.getIntPref("extensions.importexporttoolsngmodpec.autobackup.type");
    document.getElementById("saveMode").selectedIndex = IETprefs.getIntPref("extensions.importexporttoolsngmodpec.autobackup.save_mode");

    var last = IETprefs.getIntPref("extensions.importexporttoolsngmodpec.autobackup.last") * 1000;
    if (last > 0) {
        var time = new Date(last);
        var localTime = time.toLocaleString();
        document.getElementById("backupLast").value = localTime;
    }
    document.getElementById("modalWin").checked = IETprefs.getBoolPref("extensions.importexporttoolsngmodpec.autobackup.use_modal_dialog");
}

/* function setSaveMode(type) {
	var saveMode = IETprefs.getIntPref("extensions.importexporttoolsngmodpec.autobackup.save_mode");
	if (saveMode == 0 || (saveMode == 2 && type ==0))
		document.getElementById("saveMode").selectedIndex = 0;
	else
		document.getElementById("saveMode").selectedIndex = 1;
}

function toggleType(el) {
	setSaveMode(el.selectedIndex);
}*/

function saveMboxImportPrefs() {
    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.export.overwrite", document.getElementById("MBoverwrite").checked);
    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.export.filenames_toascii", document.getElementById("MBasciiname").checked);
    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.confirm.before_mbox_import", document.getElementById("MBconfrimimport").checked);
    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.export.HTML_as_displayed", document.getElementById("MBhtmlasdisplayed").checked);
    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.clipboard.always_just_text", document.getElementById("MBcliptextplain").checked);
    IETprefs.setIntPref("extensions.importexporttoolsngmodpec.subject.max_length", document.getElementById("MBsubmaxlen").value);
    IETprefs.setIntPref("extensions.importexporttoolsngmodpec.author.max_length", document.getElementById("MBauthmaxlen").value);
    IETprefs.setIntPref("extensions.importexporttoolsngmodpec.recipients.max_length", document.getElementById("MBrecmaxlen").value);
    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.export.set_filetime", document.getElementById("setTimestamp").checked);
    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.export.filenames_addtime", document.getElementById("addtimeCheckbox").checked);
    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.import.build_mbox_index", document.getElementById("buildMSF").checked);
    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.import.name_add_number", document.getElementById("addNumber").checked);

    if (document.getElementById("customizeFilenames").checked)
        IETprefs.setIntPref("extensions.importexporttoolsngmodpec.exportEML.filename_format", 2);
    else
        IETprefs.setIntPref("extensions.importexporttoolsngmodpec.exportEML.filename_format", 0);

    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.exportMBOX.use_dir", document.getElementById("use_export_mbox_dir").checked);
    if (document.getElementById("export_mbox_dir").value !== "")
        IETsetComplexPref("extensions.importexporttoolsngmodpec.exportMBOX.dir", document.getElementById("export_mbox_dir").value);
    else
        IETprefs.deleteBranch("extensions.importexporttoolsngmodpec.exportMBOX.dir");

    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.exportEML.use_dir", document.getElementById("use_export_eml_dir").checked);
    if (document.getElementById("export_eml_dir").value !== "")
        IETsetComplexPref("extensions.importexporttoolsngmodpec.exportEML.dir", document.getElementById("export_eml_dir").value);
    else
        IETprefs.deleteBranch("extensions.importexporttoolsngmodpec.exportEML.dir");

    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.exportMSG.use_dir", document.getElementById("use_export_msgs_dir").checked);
    if (document.getElementById("export_msgs_dir").value !== "")
        IETsetComplexPref("extensions.importexporttoolsngmodpec.exportMSG.dir", document.getElementById("export_msgs_dir").value);
    else
        IETprefs.deleteBranch("extensions.importexporttoolsngmodpec.exportMSG.dir");

    var pattern = "";
    for (let u = 1; u < 4; u++) {
        var val = document.getElementById("part" + u.toString()).selectedItem.value;
        if (u > 1 && val)
            val = "-" + val;
        pattern += val;
    }
    IETprefs.setCharPref("extensions.importexporttoolsngmodpec.export.filename_pattern", pattern);
    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.export.filename_add_prefix", document.getElementById("addPrefix").checked);
    // if (document.getElementById("prefixText").value != "")
    IETsetComplexPref("extensions.importexporttoolsngmodpec.export.filename_prefix", document.getElementById("prefixText").value);
    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.export.cut_subject", document.getElementById("cutSub").checked);
    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.export.cut_filename", document.getElementById("cutFN").checked);
    //modPEC
    if (document.getElementById("cutFNat").selectedIndex === 0)       
       IETprefs.setIntPref("extensions.importexporttoolsngmodpec.export.cut_filename_at", 256);       
     else
       IETprefs.setIntPref("extensions.importexporttoolsngmodpec.export.cut_filename_at", 140);
    //modPEC
    
    IETprefs.setCharPref("extensions.importexporttoolsngmodpec.export.filename_charset", document.getElementById("filenameCharset").value);
    IETprefs.setCharPref("extensions.importexporttoolsngmodpec.export.text_plain_charset", document.getElementById("charset-list").selectedItem.value);
    IETprefs.setCharPref("extensions.importexporttoolsngmodpec.csv_separator", document.getElementById("csvSep").value);

    if (document.getElementById("indexSetting").selectedIndex === 0)
        IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.export.use_container_folder", true);
    else
        IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.export.use_container_folder", false);

    // Backup section
    if (!document.getElementById("backupEnable").checked)
        IETprefs.setIntPref("extensions.importexporttoolsngmodpec.autobackup.frequency", 0);
    else
        IETprefs.setIntPref("extensions.importexporttoolsngmodpec.autobackup.frequency", document.getElementById("frequencyList").selectedItem.value);
    if (document.getElementById("backupDir").value)
        IETsetComplexPref("extensions.importexporttoolsngmodpec.autobackup.dir", document.getElementById("backupDir").value);
    else
        IETprefs.deleteBranch("extensions.importexporttoolsngmodpec.autobackup.dir");
    IETprefs.setIntPref("extensions.importexporttoolsngmodpec.autobackup.dir_name_type", document.getElementById("backupDirName").selectedIndex);
    if (document.getElementById("backupCustomName").value)
        IETsetComplexPref("extensions.importexporttoolsngmodpec.autobackup.dir_custom_name", document.getElementById("backupCustomName").value);
    else
        IETprefs.deleteBranch("extensions.importexporttoolsngmodpec.autobackup.dir_custom_name");
    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.export.skip_existing_msg", document.getElementById("skipMsg").checked);
    IETprefs.setBoolPref("extensions.importexporttoolsngmodpec.autobackup.use_modal_dialog", document.getElementById("modalWin").checked);
    IETprefs.setIntPref("extensions.importexporttoolsngmodpec.autobackup.type", document.getElementById("backupType").selectedIndex);
    IETprefs.setIntPref("extensions.importexporttoolsngmodpec.autobackup.save_mode", document.getElementById("saveMode").selectedIndex);
}

function customNamesCheck(el) {
    if (!el.checked) {
        document.getElementById("addtimeCheckbox").setAttribute("disabled", "true");
        document.getElementById("part1").setAttribute("disabled", "true");
        document.getElementById("part2").setAttribute("disabled", "true");
        document.getElementById("part3").setAttribute("disabled", "true");
        document.getElementById("addPrefix").setAttribute("disabled", "true");
        document.getElementById("prefixText").setAttribute("disabled", "true");
    } else {
        document.getElementById("addtimeCheckbox").removeAttribute("disabled");
        document.getElementById("part1").removeAttribute("disabled");
        document.getElementById("part2").removeAttribute("disabled");
        document.getElementById("part3").removeAttribute("disabled");
        document.getElementById("addPrefix").removeAttribute("disabled");
        document.getElementById("prefixText").removeAttribute("disabled");
    }
}

function toggleDirCheck(el) {
    if (!el.checked) {
        el.nextSibling.setAttribute("disabled", "true");
        el.nextSibling.nextSibling.setAttribute("disabled", "true");
    } else {
        el.nextSibling.removeAttribute("disabled");
        el.nextSibling.nextSibling.removeAttribute("disabled");
    }
}

function toggleBackup(el) {
    document.getElementById("frequencyList").disabled = !el.checked;
}

function toggleSkipMsg(el) {
    document.getElementById("skipMsg").disabled = (el.selectedIndex === 0);
}

//modPEC
function toggleCutFNat(el) {
	document.getElementById("cutFNat").disabled = ! el.checked;
}
//modPEC

function pickFile(el) {
    IETpickFile(el);
}

document.addEventListener("dialogaccept", function(event) {
    saveMboxImportPrefs();
});

window.addEventListener("load", function(event) {
    initMboxImportPanel();
});
