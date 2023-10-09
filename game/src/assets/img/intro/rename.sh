#!/usr/bin/env bash

IFS=''
i=1
ext=".jpg"
for f in ./*.jpg;
do
    escaped=${f//[/\\[};
    escaped=${escaped//]/\\]};
    escaped=${escaped//(/\\(};
    escaped=${escaped//)/\\)};
    escaped=${escaped// /\\ };
    cmd="mv $escaped ./$i$ext";
    echo $cmd;
    ((i+=1));
done
